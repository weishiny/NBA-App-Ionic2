import { Component, OnInit } from '@angular/core';
import { Refresher, LoadingController, AlertController, NavController, NavParams } from 'ionic-angular';
import { NBATeamMap } from '../../services/nba-team-map/nba-team-map';
import { NBADataServices } from '../../services/nba-data-services/nba-data-services';

@Component({
    templateUrl: 'build/pages/nba-game-detail/nba-game-detail.html'  
})
export class NBAGameDetailPage implements OnInit {
    NBATeamMapData: any[];
    selectedGame: {};
    selectedYear: string;
    HomeAway: string;
    HomePlayerFigureArray: any[] = [];
    AwayPlayerFigureArray: any[] = [];
    NBAGame: any[] = []; //to avoid error: Cannot read property 'push' of undefined, so we give it an initial value
    GameTitleColor: string;
    HomeTeam: string;
    AwayTeam: string;
    HomeTeamStanding: string;
    AwayTeamStanding: string; 

    constructor(private NBAteammap: NBATeamMap, private NBAdataservices: NBADataServices, 
                private GameDetailalertCtrl: AlertController, public navCtrl: NavController, navParams: NavParams,
                public loadingCtrl: LoadingController ) {
        this.NBATeamMapData = NBAteammap.getNBATeamArrayData();
        this.selectedGame = navParams.get('GameItem');
        this.selectedYear = navParams.get('SelectedYear');
        console.log(this.selectedGame);
    }

    ngOnInit() {
        this.HomeAway = 'Home'; //when entering this detail page, we show Western data initially.
        let GameDateParam: string = this.selectedGame['GameDate'];
        let GameIDParam: string = this.selectedGame['GameID'];
        let HomeTeamID: string = this.selectedGame['HomeTeamID'];
        let AwayTeamID: string = this.selectedGame['VisitorTeamID'];
        let nowLocalTime: Date = new Date();
        let nowYear: string = (nowLocalTime.getFullYear()).toString();

        this.GetNBAGameDetail(GameDateParam, GameIDParam).then(() => null).catch(this.handleError);
        this.GetTeamStanding(nowYear, HomeTeamID, AwayTeamID).then(() => null).catch(this.handleError);
    }

    onBack() {
        this.navCtrl.pop();
    }

    onSegmentChange() {
        let loader = this.loadingCtrl.create({
            content: "Please wait..."            
        });
        loader.present();

        let GameDateParam: string = this.selectedGame['GameDate'];
        let GameIDParam: string = this.selectedGame['GameID'];
        this.GetNBAGameDetail(GameDateParam, GameIDParam).then(() => loader.dismiss())
            .catch(error => {
                loader.dismiss();
            });
    }

    private GetTeamStanding(nowYear: string, homeTeamID: string, awayTeamID: string): Promise<any> {
        return this.NBAdataservices.GetTeamRank(this.selectedYear)
            .then(TeamRank => {                                
                let WestTeamRankArray: any[] = TeamRank['western']; //TeamRank is an object
                let EastTeamRankArray: any[] = TeamRank['eastern']; //TeamRank is an object
                let TotalTeam: any[] = WestTeamRankArray.concat(EastTeamRankArray);
                                
                let HomeTeam: any[] = TotalTeam.filter(mapIDTeam => mapIDTeam['TeamID'] === homeTeamID);
                let AwayTeam: any[] = TotalTeam.filter(mapIDTeam => mapIDTeam['TeamID'] === awayTeamID);

                this.HomeTeamStanding = HomeTeam[0]['Win'] + '-' + HomeTeam[0]['Loss'];
                this.AwayTeamStanding = AwayTeam[0]['Win'] + '-' + AwayTeam[0]['Loss']; 
            }).catch(this.handleError);
    }

    private GetNBAGameDetail(GameDate: string, GameID: string): Promise<any> {
        return this.NBAdataservices.GetGameDetail(GameDate, GameID)
            .then(gameDetail => {
                this.NBAGame.length = 0;
                this.HomePlayerFigureArray.length = 0;
                this.AwayPlayerFigureArray.length = 0;
                console.log(gameDetail);
                let HomePlayers: any[] = gameDetail['home']['Players'];
                let AwayPlayers: any[] = gameDetail['visitor']['Players'];

                HomePlayers.forEach(player => {
                    this.HomePlayerFigureArray.push({
                            PlayerName: player['first_name'].substring(0, 1) + '.' + player['last_name'],
                            Position: player['starting_position'] ? player['starting_position'] : '-',
                            Points: player['points'],
                            Assists: player['assists'],
                            Rebounds: parseInt(player['rebounds_defensive'], 10) + parseInt(player['rebounds_offensive'], 10),
                            FieldGoals: player['field_goals_made'] + '-' + player['field_goals_attempted'],
                            Blocks: player['blocks'],
                            Steals: player['steals'],
                            ThreePointers: player['three_pointers_made'] + '-' + player['three_pointers_attempted'],
                            FreeThrows: player['free_throws_made'] + '-' + player['free_throws_attempted'],
                            Turnovers: player['turnovers'],
                            Fouls: player['fouls'],
                            PlusMinus: player['plus_minus'],
                            Minutes: player['minutes']
                        });
                });

                AwayPlayers.forEach(player => {
                    this.AwayPlayerFigureArray.push({
                            PlayerName: player['first_name'].substring(0, 1) + '.' + player['last_name'],
                            Position: player['starting_position'] ? player['starting_position'] : '-',
                            Points: player['points'],
                            Assists: player['assists'],
                            Rebounds: parseInt(player['rebounds_defensive'], 10) + parseInt(player['rebounds_offensive'], 10),
                            FieldGoals: player['field_goals_made'] + '-' + player['field_goals_attempted'],
                            Blocks: player['blocks'],
                            Steals: player['steals'],
                            ThreePointers: player['three_pointers_made'] + '-' + player['three_pointers_attempted'],
                            FreeThrows: player['free_throws_made'] + '-' + player['free_throws_attempted'],
                            Turnovers: player['turnovers'],
                            Fouls: player['fouls'],
                            PlusMinus: player['plus_minus'],
                            Minutes: player['minutes']
                        });
                });
                
                let GameProcess: string;
                let GameType: string = gameDetail['GameProcessType'];
                switch(GameType) {
                    case 'unstart':
                        GameProcess = '';
                        break;
                    case 'live':
                        GameProcess = gameDetail['process']['Quarter'] + ' ';
                        GameProcess += gameDetail['process']['Time'].replace(/\s+/, '');        
                        break;
                    case 'over':
                        GameProcess = 'Final';
                        break;
                    default:
                        return;
                }

                let Home: any[] = gameDetail['home'];
                let Away: any[] = gameDetail['visitor'];
                let HomeAbbr: string = Home['TeamAbbr'];
                let AwayAbbr: string = Away['TeamAbbr'];
                let HomeMatchAbbrArray: any[] = this.NBATeamMapData.filter(data => data['Abbreviation'] === HomeAbbr); 
                let AwayMatchAbbrArray: any[] = this.NBATeamMapData.filter(data => data['Abbreviation'] === AwayAbbr);

                let HomeTeamColor: string = HomeMatchAbbrArray[0]['Color'];
                this.GameTitleColor = HomeTeamColor;                                        
                let HomeTeamCity: string = HomeMatchAbbrArray[0]['City'];
                let AwayTeamCity: string = AwayMatchAbbrArray[0]['City'];
                let HomeTeamName: string = HomeMatchAbbrArray[0]['Team'];
                let AwayTeamName: string = AwayMatchAbbrArray[0]['Team'];
                let HomeTeamLogo: string = HomeMatchAbbrArray[0]['imgGameUrl'];
                let AwayTeamLogo: string = AwayMatchAbbrArray[0]['imgGameUrl'];
                this.HomeTeam = HomeTeamCity + ' ' + HomeTeamName;
                this.AwayTeam = AwayTeamCity + ' ' + AwayTeamName;

                this.NBAGame.push({                            
                    HomeTeamColor: HomeTeamColor,
                    HomeTeamCity: HomeTeamCity,
                    AwayTeamCity: AwayTeamCity,
                    HomeTeamName: HomeTeamName,
                    AwayTeamName: AwayTeamName,
                    HomeTeamLogo: HomeTeamLogo,
                    AwayTeamLogo: AwayTeamLogo,                    
                    HomeScore: Home['Score'],
                    AwayScore: Away['Score'],
                    GameProcess: GameProcess
                });               
            })
            .catch(error => {
                let alert = this.GameDetailalertCtrl.create({
                        title: 'Oops!',
                        subTitle: error,
                        buttons: ['OK']
                    });
                alert.present();
            });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}