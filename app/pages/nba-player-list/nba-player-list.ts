import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { NBATeamMap } from '../../services/nba-team-map/nba-team-map';
import { NBADataServices } from '../../services/nba-data-services/nba-data-services';
import { NBAPlayerDetailPage } from '../nba-player-detail/nba-player-detail';

@Component({
    templateUrl: 'build/pages/nba-player-list/nba-player-list.html'    
})
export class NBAPlayerListPage implements OnInit {
    NBAPlayerList: any[] = [];
    NBAPlayerListLocal: any[] = [];

    constructor(private NBAteammap: NBATeamMap, private NBAdataservices: NBADataServices, 
                private PlayeralertCtrl: AlertController, public navCtrl: NavController) {

    }

    ngOnInit() {
        /* 2016.1-2016.9 is 2015 season */
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1
        let currentYear: number;
        if (currentMonth >= 10) {
            currentYear = currentDate.getFullYear();
        } else {
            currentYear = currentDate.getFullYear() - 1;
        }        
        let nowYearlastTwoChar: string =  (currentYear + 1).toString().substr(2, 2); //ex: 16
        let season: string = currentYear + '-' + nowYearlastTwoChar;        
        return this.GetNBAPlayerList(season).then(() => null).catch(this.handleError); //initialize PlayerList
    }
    
    getPlayerItem(event: any) {
        //Everytime we search for player, we need to get (initialize) the whole playerList,
        //Otherwise, when we have searched for some value and the list left some data, next time, 
        //NBAPlayerList will left some data and we will search for some data from this array that only have some value
        //ex: we search for curry, and there are two data, afterwards, we remove the filter criteria and search another
        //player, which will based on the array that only have two data.

        //initialize playerList, but we don't want to access remote nba web api, so we use the local stored list
        this.NBAPlayerList = this.NBAPlayerListLocal.slice();
        let inputValue: string = event.target.value;
        // if the value is an empty string, don't filter the items
        if (inputValue && inputValue.trim() != '') {
            this.NBAPlayerList = this.NBAPlayerList.filter(player => {
                let playerFullname: string = player.FirstName + ' ' + player.LastName; 
                return (playerFullname.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
            });
        }
    }

    PlayerItemTapped(event, PlayerItem) {
        this.navCtrl.push(NBAPlayerDetailPage, {
            PlayerID: PlayerItem['PlayerID'],
            TeamID: PlayerItem['TeamID'],
            TeamColor: PlayerItem['TeamColor']            
        });
    }

    private GetNBAPlayerList(season: string): Promise<any> {
        return this.NBAdataservices.GetPlayerList(season)
            .then((PlayerList: any[]) => {                
                console.log(PlayerList); //it's not sorted
                PlayerList = PlayerList.filter(player => {
                    return player['TeamID'] !== 0;
                }); //remove the player who have no team (TeamID is 0)
                let PlayerListArray: any[] = PlayerList.slice(); //it actually copy a array to new array
                this.NBAPlayerList.length = 0;
                /**
                 * arr.sort([compareFunction])
                 * compareFunction: Optional. Specifies a function that defines the sort order. If omitted, 
                 * the array is sorted according to each character's Unicode code point value, according to 
                 * the string conversion of each element.
                 * If compareFunction is supplied, the array elements are sorted according to the return value of the compare function. 
                 * If a and b are two elements being compared, then:
                 * 
                 * If compareFunction(a, b) is less than 0, sort a to a lower index than b, i.e. a comes first.
                 * If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. 
                 * If compareFunction(a, b) is greater than 0, sort b to a lower index than a.
                 * compareFunction(a, b) must always return the same value when given a specific pair of elements a and b as its two arguments. 
                 * If inconsistent results are returned then the sort order is undefined.
                 */
                PlayerListArray.forEach((player, index) => {
                    let NBAMatchIDArray: any[] = this.NBAteammap.getNBATeamArrayData().filter(data => data['id'] === player['TeamID'].toString());
                    let TeamLogo: string = NBAMatchIDArray[0]['imgTeamUrl'];
                    let TeamColor: string = NBAMatchIDArray[0]['Color'];
                    PlayerListArray[index]['TeamLogo'] = TeamLogo;
                    PlayerListArray[index]['TeamColor'] = TeamColor;
                });
                this.NBAPlayerListLocal = PlayerListArray.sort((a, b) => {
                    return (a.FirstName > b.FirstName) ? 1 : ((b.FirstName > a.FirstName) ? -1 : 0);                    
                });                
                this.NBAPlayerList = this.NBAPlayerListLocal.slice();
                console.log(this.NBAPlayerList); //it's sorted
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}