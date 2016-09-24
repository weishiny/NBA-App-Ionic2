import { Component, OnInit, ViewChild } from '@angular/core';
import { Slides, AlertController, NavController } from 'ionic-angular';
import { NBATeamDataType } from '../../base-data-type/nba-team-datatype';
import { NBATeamMap } from '../../services/nba-team-map/nba-team-map';
import { NBADataServices } from '../../services/nba-data-services/nba-data-services';
import { NBATeamDetailPage } from '../nba-team-detail/nba-team-detail';

@Component({
    templateUrl: 'build/pages/nba-team-list/nba-team-list.html'    
})
export class NBATeamListPage implements OnInit{
    @ViewChild(Slides) NBASlides: Slides;    
    NBAWestTeamItem: any[] = [];
    NBAEastTeamItem: any[] = [];
    ConferenceTitle: string = 'Western'; //default value is Western
    TeamYear: string;

    constructor(private NBAteammap: NBATeamMap, private NBAdataservices: NBADataServices,
                private TeamalertCtrl: AlertController, public navCtrl: NavController) {
                        
    }

    ngOnInit() {
        let nowLocalTime: Date = new Date();
        let nowYear: string = (nowLocalTime.getFullYear()).toString();
        this.GetNBATeamList(nowYear).then(() => null).catch(this.handleError);
        this.TeamYear = nowYear;
        //We can not use slides in ngOnInit. it will cause error, maybe due to the reason that slides is still not be rendered        
        //let slideIndex: number = this.NBASlides.getActiveIndex();                
    }   

    onSlideChanged() {
        let slideIndex: number = this.NBASlides.getActiveIndex();
        this.ConferenceTitle = slideIndex == 0 ? 'Western' : (slideIndex == 1) ? 'Eastern' : '';
    }

    onDateChange() {
        //TeamYear is two way binding, so whenever the datepicker is changed, we just use TeamYear
        this.GetNBATeamList(this.TeamYear).then(() => null).catch(this.handleError);
    }

    TeamItemTapped(event, TeamItem, TeamConfparam) {
        this.navCtrl.push(NBATeamDetailPage, {
            TeamItem: TeamItem,
            TeamConfparam: TeamConfparam,
            TeamYearparam: this.TeamYear
        });
    }

    private GetNBATeamList(GameYear: string): Promise<any> {
        return this.NBAdataservices.GetTeamRank(GameYear)
            .then(TeamRank => {                               
                console.log('**NBA Team List Page: Parsed NBA Data**');                               
                console.log(TeamRank);
                //before everytime we get data, we should clear the former game data
                this.NBAWestTeamItem.length = 0;
                this.NBAEastTeamItem.length = 0;

                let WestTeamRankArray: any[] = TeamRank['western']; //TeamRank is an object
                let EastTeamRankArray: any[] = TeamRank['eastern']; //TeamRank is an object

                //Western
                WestTeamRankArray.forEach((EachTeamitem, index) => {
                    let WestTeamStanding: string = (index + 1).toString();
                    let WestTeamID: string = EachTeamitem['TeamID'];
                    let NBAWestMatchIDArray: any[] = this.NBAteammap.getNBATeamArrayData().filter(data => data['id'] === WestTeamID);
                                                            
                    let WestTeamCity: string = NBAWestMatchIDArray[0]['City'];                        
                    let WestTeamName: string = NBAWestMatchIDArray[0]['Team'];                        
                    let WestTeamLogo: string = NBAWestMatchIDArray[0]['imgTeamUrl'];
                    let WestTeamConf: string = EachTeamitem['TeamConf'];
                    let WestTeamWin: string = EachTeamitem['Win'];
                    let WestTeamLoss: string = EachTeamitem['Loss'];
                    let WestTeamPCT: string = EachTeamitem['PCT'];

                    this.NBAWestTeamItem.push({
                        WestTeamID: WestTeamID,
                        WestTeamStanding: WestTeamStanding,
                        WestTeamCity: WestTeamCity,
                        WestTeamName: WestTeamName,
                        WestTeamLogo: WestTeamLogo,
                        WestTeamConf: WestTeamConf,
                        WestTeamWin: WestTeamWin,
                        WestTeamLoss: WestTeamLoss,
                        WestTeamPCT: WestTeamPCT
                    });                        
                });
                
                //Eastern
                EastTeamRankArray.forEach((EachTeamitem, index) => {
                    let EastTeamStanding: string = (index + 1).toString();
                    let EastTeamID: string = EachTeamitem['TeamID'];
                    let NBAEastMatchIDArray: any[] = this.NBAteammap.getNBATeamArrayData().filter(data => data['id'] === EastTeamID);
                                                            
                    let EastTeamCity: string = NBAEastMatchIDArray[0]['City'];                        
                    let EastTeamName: string = NBAEastMatchIDArray[0]['Team'];                        
                    let EastTeamLogo: string = NBAEastMatchIDArray[0]['imgTeamUrl'];
                    let EastTeamConf: string = EachTeamitem['TeamConf'];
                    let EastTeamWin: string = EachTeamitem['Win'];
                    let EastTeamLoss: string = EachTeamitem['Loss'];
                    let EastTeamPCT: string = EachTeamitem['PCT'];

                    this.NBAEastTeamItem.push({
                        EastTeamID: EastTeamID,
                        EastTeamStanding: EastTeamStanding,
                        EastTeamCity: EastTeamCity,
                        EastTeamName: EastTeamName,
                        EastTeamLogo: EastTeamLogo,
                        EastTeamConf: EastTeamConf,
                        EastTeamWin: EastTeamWin,
                        EastTeamLoss: EastTeamLoss,
                        EastTeamPCT: EastTeamPCT
                    });
                });
        })
        .catch(error => {
            let alert = this.TeamalertCtrl.create({
                        title: 'Oops!',
                        subTitle: 'Sorry, There are not any NBA data.',
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