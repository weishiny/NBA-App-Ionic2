import { Component } from '@angular/core';
import { Refresher } from 'ionic-angular';
import { NBATeamDataType } from '../../base-data-type/nba-team-datatype';
import { NBATeamMap } from '../../services/nba-team-map/nba-team-map';
import { NBADataServices } from '../../services/nba-data-services/nba-data-services';

@Component({
    templateUrl: 'build/pages/nba-team-list/nba-team-list.html'    
})
export class NBATeamListPage {
    NBATeamItem: NBATeamDataType[];


    constructor(private NBAteammap: NBATeamMap, private NBAdataservices: NBADataServices) {
        this.NBATeamItem = NBAteammap.getNBATeamData();
        this.NBAdataservices.GetTeamRank('2015')
                           .then(ParsedData => {                               
                               console.log('**NBA Team List Page: Parsed NBA Data**');                               
                               console.log(ParsedData);
                           })
                           .catch(error => {
                               alert(error);
                           });
    }

    doRefresh(refresher: Refresher) {
        this.NBAteammap.getAsyncNBATeamData().then(NBATeamData => {
            /*The unshift() method adds one or more elements to the beginning 
              of an array and returns the new length of the array.
            */
            for (let i = 0; i < NBATeamData.length; i++) {
                this.NBATeamItem.unshift(NBATeamData[i]);
            }            
            refresher.complete();
        });        
    }
}