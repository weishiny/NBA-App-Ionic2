import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NBAGameListPage } from '../nba-game-list/nba-game-list';
import { NBAPlayerListPage } from '../nba-player-list/nba-player-list';
import { NBATeamListPage } from '../nba-team-list/nba-team-list';

@Component({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
    // set the root pages for each tab
    gamesTabRoot: any = NBAGameListPage;
    playersTabRoot: any = NBAPlayerListPage;
    teamsTabRoot: any = NBATeamListPage;
    mySelectedIndex: number;
    constructor(private navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}