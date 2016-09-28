import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HelloIonicPage } from './pages/hello-ionic/hello-ionic';
import { ListPage } from './pages/list/list';
import { TabsPage } from './pages/tabs/tabs';
import { NBATeamMap } from './services/nba-team-map/nba-team-map';
import { NBADataServices } from './services/nba-data-services/nba-data-services';
import { NBADataAddress } from './services/nba-data-services/nba-data-address';
//we need to import this chart.js file in app.ts so that we can let chart be displayed in Ionic2 project
import '../node_modules/chart.js/dist/Chart.bundle.min.js';
//import {NBATeamListPage} from './pages/nba-team-list/nba-team-list'; //改用TabsPage控制

@Component({
  templateUrl: 'build/app.html',
  providers: [NBATeamMap, NBADataServices, NBADataAddress]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  TerrenceRootPage: any = HelloIonicPage;
  pages: Array<{title: string, component: any, index?: number, icon: string}>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage, icon: 'information-circle' },
      { title: 'My First List', component: ListPage, icon: 'calendar' },
      { title: 'NBA Pages', component: TabsPage, index: 0, icon: 'analytics' }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    if (page.index) {
      //only TabsPage
      this.nav.setRoot(page.component, {tabIndex: page.index});
    } else {
      this.nav.setRoot(page.component);
    }
  }
}

ionicBootstrap(MyApp);
