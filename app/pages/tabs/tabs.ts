import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NBATeamListPage } from '../nba-team-list/nba-team-list';

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
    // set the root pages for each tab
    gamesTabRoot: any = NBATeamListPage;
    playersTabRoot: any = NBATeamListPage;
    teamsTabRoot: any = NBATeamListPage;
    mySelectedIndex: number;
    constructor(private navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}