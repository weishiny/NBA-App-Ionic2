import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, NavController, NavParams } from 'ionic-angular';
import { NBATeamMap } from '../../services/nba-team-map/nba-team-map';
import { NBADataServices } from '../../services/nba-data-services/nba-data-services';
import { PlayerChartComponent } from '../nba-player-chart/nba-player-chart';

@Component({
    templateUrl: 'build/pages/nba-player-detail/nba-player-detail.html',
    directives: [PlayerChartComponent]    
})
export class NBAPlayerDetailPage implements OnInit {
    selectedPlayerID: string;
    selectedTeamID: string;
    selectedTeamColor: string;
    NBATeamMapData: any[];
    PtsRank: string;
    RebRank: string;
    AstRank: string;
    NBAPlayerInfo: any[] = [];    
    PlayerTitleColor: string;
    PlayerID: string;

    constructor(private NBAteammap: NBATeamMap, private NBAdataservices: NBADataServices, 
                private PlayerDetailalertCtrl: AlertController, public navCtrl: NavController, navParams: NavParams,
                public loadingCtrl: LoadingController) {
        this.selectedPlayerID = navParams.get('PlayerID');
        this.selectedTeamID = navParams.get('TeamID');
        //get color from master page (nba-player-list/nba-team-detail) to avoid asynchronous issue,
        //if we use the variable (i.e. PlayerTitleColor) to give the Bindingcolor @Input a value, 
        //we can't ensure the variable can receive value after asynchronous operation (GetPlayerRecord)
        //because nba-player-detail and nba-player-chart are on the same stage, so we can not make sure
        //that the bar chart's background color will be changed according to the team's color.
        //Thus, we use the variable from parent page to get team color absolutely.
        this.selectedTeamColor = navParams.get('TeamColor');
        this.NBATeamMapData = NBAteammap.getNBATeamArrayData();
    }

    ngOnInit() {        
        let playerID: string = this.selectedPlayerID;
        this.PlayerID = playerID;
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."            
        });
        loader.present();

        this.GetPlayerRecord(playerID).then(() => loader.dismiss())
            .catch(error => {
                loader.dismiss();
            });
    }

    onBack() {
        this.navCtrl.pop();
    }
    
    private GetPlayerRecord(PlayerID: string): Promise<any> {
        return this.NBAdataservices.GetPlayerInfo(PlayerID)
            .then(playerInfo => {                
                this.NBAPlayerInfo.length = 0;
                this.PtsRank = playerInfo['Pts'];
                this.AstRank = playerInfo['Ast'];
                this.RebRank = playerInfo['Reb'];
                let TeamID: string = this.selectedTeamID.toString();                
                let NBAMatchIDArray: any[] = this.NBATeamMapData.filter(data => data['id'] === TeamID);
                console.log(NBAMatchIDArray);
                console.log(TeamID);
                let TeamColor: string = NBAMatchIDArray[0]['Color'];
                this.PlayerTitleColor = TeamColor;

                let PlayerPicUrl = 'http://stats.nba.com/media/players/230x185/' + playerInfo['PlayerID'] + '.png';
                //let PlayerPicUrl = 'statsProxy/media/players/230x185/' + playerInfo['PlayerID'] + '.png';

                this.NBAPlayerInfo.push({
                    Affiliation: playerInfo['Affiliation'],                    
                    Ast: playerInfo['Ast'],
                    Birthday: playerInfo['Birthday'],                    
                    FirstName: playerInfo['FirstName'],                    
                    Height: playerInfo['Height'],                    
                    JerseyNum: playerInfo['JerseyNum'],                    
                    LastName: playerInfo['LastName'],                    
                    PlayerID: playerInfo['PlayerID'],                   
                    Position: playerInfo['Position'],                    
                    Pts: playerInfo['Pts'],                    
                    Reb: playerInfo['Reb'],                    
                    Team: playerInfo['Team'],                    
                    Weight: playerInfo['Weight'],
                    TeamColor: TeamColor,
                    PlayerPicUrl: PlayerPicUrl                    
                });
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        alert(error);
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}