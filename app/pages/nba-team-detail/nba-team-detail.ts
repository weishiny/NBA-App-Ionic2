import { Component, OnInit } from '@angular/core';
import { Refresher, LoadingController, AlertController, NavController, NavParams } from 'ionic-angular';
import { NBATeamMap } from '../../services/nba-team-map/nba-team-map';
import { NBADataServices } from '../../services/nba-data-services/nba-data-services';
import { NBAPlayerDetailPage } from '../nba-player-detail/nba-player-detail';

@Component({
    templateUrl: 'build/pages/nba-team-detail/nba-team-detail.html'  
})
export class NBATeamDetailPage implements OnInit {
    NBATeamMapData: any[];
    selectedTeam: {};
    selectedTeamConfparam: string;
    selectedYear: string;
    NBATeamInfo: any[] = [];    
    NBATeamPlayerBasicInfoStat: any[] = [];    
    TeamTitleColor: string;
    PtsRank: string;
    RebRank: string;
    AstRank: string;
    OppRank: string;
    
    constructor(private NBAteammap: NBATeamMap, private NBAdataservices: NBADataServices, 
                private TeamDetailalertCtrl: AlertController, public navCtrl: NavController, navParams: NavParams,
                public loadingCtrl: LoadingController) {
        this.NBATeamMapData = NBAteammap.getNBATeamArrayData();
        this.selectedTeam = navParams.get('TeamItem');
        this.selectedTeamConfparam = navParams.get('TeamConfparam');
        this.selectedYear = navParams.get('TeamYearparam');        
    }

    ngOnInit() {
        let TeamIDParam: string;
        switch(this.selectedTeamConfparam) {            
            case 'West':
                TeamIDParam = this.selectedTeam['WestTeamID'];
                break;
            case 'East':
                TeamIDParam = this.selectedTeam['EastTeamID'];
                break;
            default:
                return;
        }                                
        let nowLocalTime: Date = new Date();
        let nowYear: string =  this.selectedYear; //ex: 2015
        let nowYearlastTwoChar: string =  (parseInt(this.selectedYear, 10) + 1).toString().substr(2, 2); //ex: 16
        let season = nowYear + '-' + nowYearlastTwoChar;
        
        this.GetTeamInfo(TeamIDParam, season).then(() => null).catch(this.handleError);                
    }

    onBack() {
        this.navCtrl.pop();
    }

    PlayerItemTapped(event, PlayerBasicInfoStat) {
        console.log(PlayerBasicInfoStat);
        this.navCtrl.push(NBAPlayerDetailPage, {
            PlayerID: PlayerBasicInfoStat['PlayerID'],
            TeamID: PlayerBasicInfoStat['TeamID'],
            TeamColor: PlayerBasicInfoStat['TeamColor']             
        });
    }

    private GetTeamInfo(TeamID: string, season: string): Promise<any> {        
        return this.NBAdataservices.GetTeamInfo(TeamID, season)
            .then(TeamInfo => {               
                this.NBATeamInfo.length = 0;
                let NBAMatchIDArray: any[] = this.NBAteammap.getNBATeamArrayData().filter(data => data['id'] === TeamID);
                let TeamLogo: string = NBAMatchIDArray[0]['imgGameUrl'];
                let TeamColor: string = NBAMatchIDArray[0]['Color'];
                this.TeamTitleColor = TeamColor;

                this.NBATeamInfo.push({
                    TeamLogo: TeamLogo,
                    TeamColor: TeamColor,
                    TeamCity: TeamInfo['TeamCity'],
                    TeamName: TeamInfo['TeamName'],
                    TeamAbbr: TeamInfo['TeamAbbr'],
                    TeamConf: TeamInfo['TeamConf'],
                    TeamDivi: TeamInfo['TeamDivi'],
                    ConfRank: TeamInfo['ConfRank'],
                    DiviRank: TeamInfo['DiviRank'],
                    Win: TeamInfo['Win'],
                    Loss: TeamInfo['Loss'],
                    TeamID: TeamInfo['TeamID'],
                    PtsRank: TeamInfo['PtsRank'],
                    RebRank: TeamInfo['RebRank'],
                    AstRank: TeamInfo['AstRank'],
                    OppRank: TeamInfo['OppRank']
                });
                
                let ptsrank = TeamInfo['PtsRank'];
                let rebrank = TeamInfo['RebRank'];
                let astrank = TeamInfo['AstRank'];
                let opprank = TeamInfo['OppRank'];

                this.PtsRank = ptsrank == '1' ? ptsrank + ' st' : (ptsrank == '2' ? ptsrank + ' nd' : (ptsrank == '3' ? ptsrank + ' rd' : ptsrank + ' th')); 
                this.RebRank = rebrank == '1' ? rebrank + ' st' : (rebrank == '2' ? rebrank + ' nd' : (rebrank == '3' ? rebrank + ' rd' : rebrank + ' th'));
                this.AstRank = astrank == '1' ? astrank + ' st' : (astrank == '2' ? astrank + ' nd' : (astrank == '3' ? astrank + ' rd' : astrank + ' th'));
                this.OppRank = opprank == '1' ? opprank + ' st' : (opprank == '2' ? opprank + ' nd' : (opprank == '3' ? opprank + ' rd' : opprank + ' th'));
            })
            .then(() => {
                //force GetTeamDetail service execute after GetTeamInfo service
                this.NBAdataservices.GetTeamDetail(season, TeamID)
                    .then(TeamDetailPlayerGameStat => {                                                
                        return TeamDetailPlayerGameStat;
                        //return Promise.resolve(TeamDetailPlayerGameStat);
                    })
                    .then((PlayerGameStatParam) => {
                        //force GetTeamDetailBasic service execute after GetTeamDetail service
                        this.NBAdataservices.GetTeamDetailBasic(season, TeamID)
                            .then((TeamDetailPlayerBasicInfo) => {                                
                                //Due to the asynchronous operation, we need to use promise chaining to achieve
                                //the synchronous operation. In only this area, we can get NBATeamPlayerStatArray 
                                //and NBATeamPlayerInfoObject. 
                                console.log('***Get Player Basic Info and Stat***');
                                console.log(PlayerGameStatParam);
                                console.log(TeamDetailPlayerBasicInfo);

                                this.NBATeamPlayerBasicInfoStat.length = 0;
                                let PlayerStatArray: any[] = PlayerGameStatParam;
                                PlayerStatArray.forEach(playerstat => {
                                    if (typeof TeamDetailPlayerBasicInfo[playerstat['PlayerID']] !== "undefined" && TeamDetailPlayerBasicInfo[playerstat['PlayerID']] !== null) {
                                        let PlayerPicUrl = 'http://stats.nba.com/media/players/230x185/' + playerstat['PlayerID'] + '.png';
                                        //let PlayerPicUrl = 'statsProxy/media/players/230x185/' + playerstat['PlayerID'] + '.png';
                                        this.NBATeamPlayerBasicInfoStat.push({
                                            TeamID: TeamID,
                                            TeamColor: this.TeamTitleColor,
                                            PlayerPicUrl: PlayerPicUrl,                                         
                                            Ast: playerstat['Ast'],
                                            Gp: playerstat['Gp'],
                                            Min: playerstat['Min'],
                                            Name: playerstat['Name'],
                                            PlayerID: playerstat['PlayerID'],
                                            Pts: playerstat['Pts'],
                                            Reb: playerstat['Reb'],
                                            //use Player ID to get PlayerID object (Basic Info)                                        
                                            Age: TeamDetailPlayerBasicInfo[playerstat['PlayerID']]['Age'],                                         
                                            Height: TeamDetailPlayerBasicInfo[playerstat['PlayerID']]['Height'],                                        
                                            JerseyNum: TeamDetailPlayerBasicInfo[playerstat['PlayerID']]['JerseyNum'],                                                                                
                                            Pos: TeamDetailPlayerBasicInfo[playerstat['PlayerID']]['Pos'],                                        
                                            Weight: TeamDetailPlayerBasicInfo[playerstat['PlayerID']]['Weight']                                         
                                        });
                                    }                                    
                                });                                
                            })                            
                            .catch(this.handleError);
                    })                    
                    .catch(this.handleError);
            })            
            .catch(this.handleError);            
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}