import { Component, OnInit } from '@angular/core';
import { Refresher, AlertController, NavController } from 'ionic-angular';
import { DatePicker } from 'ionic-native';
import { NBATeamDataType } from '../../base-data-type/nba-team-datatype';
import { NBATeamMap } from '../../services/nba-team-map/nba-team-map';
import { NBADataServices } from '../../services/nba-data-services/nba-data-services';
import { NBAGameDetailPage } from '../nba-game-detail/nba-game-detail';

@Component({
    templateUrl: 'build/pages/nba-game-list/nba-game-list.html'    
})
export class NBAGameListPage implements OnInit{
    
    NBATeamMapData: any[];
    NBAGameList: any[] = []; //to avoid error: Cannot read property 'push' of undefined, so we give it an initial value
    gameCount: number;
    gameDate: string;        
    ChangedDate: string;

    constructor(private NBAteammap: NBATeamMap, private NBAdataservices: NBADataServices, 
                private GamealertCtrl: AlertController, public navCtrl: NavController ) {
        this.NBATeamMapData = NBAteammap.getNBATeamArrayData();                       
    }

    ngOnInit() {        
        let nowLocalTime: Date = new Date();        
        //we use America/Los_Angeles time zone because L.A. game start at last in one day.        
        let SpecificDateTimeArray: any[] = this.GetSpecificTimeZoneFormat(nowLocalTime, -7);
        this.ChangedDate = SpecificDateTimeArray[0] + SpecificDateTimeArray[1] + SpecificDateTimeArray[2];
        this.gameDate = SpecificDateTimeArray[0] + '-' + SpecificDateTimeArray[1] + '-' + SpecificDateTimeArray[2];      
        this.GetNBAGameList(this.ChangedDate).then(() => null).catch(this.handleError);         
    }

    doRefresh(refresher: Refresher) {                                 
        this.GetNBAGameList(this.ChangedDate).then(() => refresher.complete()).catch(this.handleError);
    }

    OpenDatePicker(): void {        
        DatePicker.show({
            date: new Date(),
            mode: 'datetime',
            androidTheme : 3
        }).then(
            date => {                
                let SpecificDateTimeArray: any[] = this.GetSpecificTimeZoneFormat(date, -7);
                this.ChangedDate = SpecificDateTimeArray[0] + SpecificDateTimeArray[1] + SpecificDateTimeArray[2];
                this.gameDate = SpecificDateTimeArray[0] + '-' + SpecificDateTimeArray[1] + '-' + SpecificDateTimeArray[2];
                this.GetNBAGameList(this.ChangedDate).then(() => null).catch(this.handleError);
            },
            error => console.log('Error occurred while getting date: ', error)
        );
    }

    GameItemTapped(event, GameItem) {
        this.navCtrl.push(NBAGameDetailPage, {
            GameItem: GameItem
        });
    }

    /**
     * @Param: nowDateTime, UTC
     * @Example: UTC => +8: "Asia/Shanghai", -4: "America/New_York", -7: "America/Los_Angeles"
     * @Remark: "Asia/Shanghai" => GMT+8 (CST)
     *          "America/New_York" => GMT-4 (EDT) 
     *          "America/Los_Angeles" => GMT-7 (PDT)
     */
    private GetSpecificTimeZoneFormat(SpecificLocalDateTime: Date, UTC: number): any[] {                
        let YMDDateArray: any[] = []; //need to assign initial value or occur error : cannot access property push of undefined 
        
        //Return the number of milliseconds since 1970/01/01
        let localTime: number = SpecificLocalDateTime.getTime();
        
        //Return the timezone difference between UTC and Local Time
        //By default, this method returns the time zone offset in minutes, so convert this value to milliseconds for easier manipulation:
        //Note that a negative return value from getTimezoneOffset() indicates that the current location is ahead of UTC, 
        //while a positive value indicates that the location is behind UTC. (ex: Taiwan is UTC+8 => 8 * 60 = -480)

        //Obtain local UTC offset and convert to msec                
        let localOffset: number = SpecificLocalDateTime.getTimezoneOffset() * 60000;
        //Obtain UTC time in msec
        let utc = localTime + localOffset;

        // Obtain and add destination's UTC time offset. For example, America/Los_Angeles which is UTC - 7 hours
        let offset = UTC;
        //Note: In case you're wondering how I arrived at 3600000 as the multiplication factor, remember that 
        //1000 millseconds = 1 second, and 1 hour = 3600 seconds. Therefore, converting hours to milliseconds 
        //involves multiplying by 3600 * 1000 = 3600000.
        let timezone = utc + (3600000 * offset);
        let anotherTimeZoneTime = new Date(timezone);
      
        let nowYear: string = anotherTimeZoneTime.getFullYear().toString();
        //Months are zero based
        let nowMonth: string =  (anotherTimeZoneTime.getMonth() + 1) < 10 ? "0" + (SpecificLocalDateTime.getMonth() + 1).toString() : (SpecificLocalDateTime.getMonth() + 1).toString();
        let nowDate: string = anotherTimeZoneTime.getDate() < 10 ? "0" + SpecificLocalDateTime.getDate().toString() : SpecificLocalDateTime.getDate().toString(); 
        
        //let nowHour: string = anotherTimeZoneTime.getHours() < 10 ? "0" + SpecificLocalDateTime.getHours().toString() : SpecificLocalDateTime.getHours().toString();      
        //let nowMinute: string = anotherTimeZoneTime.getMinutes().toString();
        //let nowSecond: string = anotherTimeZoneTime.getSeconds().toString();
        
        YMDDateArray.push(nowYear, nowMonth, nowDate);        
        return YMDDateArray;         
        //[0]:year, [1]:month, [2]:day
    }    

    private GetNBAGameList(GameDate: string): Promise<any> {        
        return this.NBAdataservices.GetGameGeneral(GameDate)
            .then(gameGeneral => {
                //before everytime we get data, we should clear the former game data
                this.NBAGameList.length = 0;

                let unstartArray: any[] = gameGeneral['unstart'];
                let liveArray: any[] = gameGeneral['live'];
                let overArray: any[] = gameGeneral['over'];
                this.gameCount = unstartArray.length + liveArray.length + overArray.length;
                
                if(this.gameCount !== 0) {
                    //The concat() method is used to join two or more arrays.
                    let totalArray: any[] = unstartArray.concat(liveArray, overArray);

                    totalArray.forEach(EachGameitem => {
                        let GameID: string = EachGameitem['gameID'];
                        let GameDate: string = EachGameitem['gameDate'];
                        let HomeTeamID: string = EachGameitem['home']['TeamID'];                        
                        let HomeAbbr: string = EachGameitem['home']['TeamAbbr'];
                        let VisitorTeamID: string = EachGameitem['visitor']['TeamID'];
                        let VisitorAbbr: string = EachGameitem['visitor']['TeamAbbr'];
                        
                        let GameProcess: string;
                        let GameType: string = EachGameitem['GameProcessType'];
                        switch(GameType) {
                            case 'unstart':
                                GameProcess = EachGameitem['GameDate'].replace(/\s*ET\s*/, '');
                                break;
                            case 'live':
                                GameProcess += EachGameitem['process']['Quarter'] + ' ';
                                GameProcess += EachGameitem['process']['Time'].replace(/\s+/, '');        
                                break;
                            case 'over':
                                GameProcess = 'Final';
                                break;
                            default:
                                return;
                        }

                        let HomeScore: number = EachGameitem['home']['Score'];
                        let VisitorScore: number = EachGameitem['visitor']['Score'];
                        //Get City, Team Name, Logo, Color from TeamMap services based on Abbreviation, so use Array.filter to get match result
                        //Only return an array that count is 1 because Abbreviation is unique.
                        let HomeMatchAbbrArray: any[] = this.NBATeamMapData.filter(data => data['Abbreviation'] === HomeAbbr); 
                        let VisitorMatchAbbrArray: any[] = this.NBATeamMapData.filter(data => data['Abbreviation'] === VisitorAbbr);
                        
                        let HomeTeamColor: string = HomeMatchAbbrArray[0]['Color'];                                        
                        let HomeTeamCity: string = HomeMatchAbbrArray[0]['City'];
                        let VisitorTeamCity: string = VisitorMatchAbbrArray[0]['City'];
                        let HomeTeamName: string = HomeMatchAbbrArray[0]['Team'];
                        let VisitorTeamName: string = VisitorMatchAbbrArray[0]['Team'];
                        let HomeTeamLogo: string = HomeMatchAbbrArray[0]['imgGameUrl'];
                        let VisitorTeamLogo: string = VisitorMatchAbbrArray[0]['imgGameUrl'];
                        
                        //Finally, we create an array contains all information we want to show in html, and use this array 
                        //as the datasource of ion-card, which use *ngFor to produce game list.
                        this.NBAGameList.push({
                            GameID: GameID,
                            GameDate: GameDate,
                            HomeTeamID: HomeTeamID,
                            HomeTeamColor: HomeTeamColor,
                            HomeTeamCity: HomeTeamCity,
                            VisitorTeamID: VisitorTeamID,
                            VisitorTeamCity: VisitorTeamCity,
                            HomeTeamName: HomeTeamName,
                            VisitorTeamName: VisitorTeamName,
                            HomeTeamLogo: HomeTeamLogo,
                            VisitorTeamLogo: VisitorTeamLogo,
                            GameProcess: GameProcess,
                            HomeScore: HomeScore,
                            VisitorScore: VisitorScore
                        });
                    });
                }
                else {
                    this.gameCount = 0;
                    let alert = this.GamealertCtrl.create({
                        title: 'Oops!',
                        subTitle: 'There are not any game today or the day you select.',
                        buttons: ['OK']
                    });
                    alert.present();
                }              
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}