//    ./同層目錄; ../上一層目錄; ../../上兩層目錄
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class NBADataAddress {    
     
    /**
     * Connect to remote serve or Web Api, we will run into the CORs issue
     * For CORs issue, execute CLI such as 'ionic serve' or 'ionic run android -l' 
     * there is need to set up Proxy in ionic.config.json and then each Url's domain 
     * need to be replaced with path:
     * "proxies": [
            { "path": "/dataProxy", "proxyUrl": "http://data.nba.com/" },
            { "path": "/statsProxy","proxyUrl": "http://stats.nba.com/" }
        ]
     * So http://data.nba.com/data/5s/json/cms/noseason/scoreboard/20151125/games.json should be replaced with
     *    dataProxy/data/5s/json/cms/noseason/scoreboard/20151125/games.json
     * But for command: 'ionic run android', run on devices or emulator, we don't need to set up proxy, but we
     * need to set <meta http-equiv="Content-Security-Policy" ...> in index.html to avoid CORs issue. 
     *  
     */
    
    constructor(private http: Http) {

    }        

    /**@Param: GameDate
     * @Example: GameDate => 20151125 
     */
    GameGeneral(GameDate: string): Promise<any> {        
        //let GameGeneralUrl = 'http://data.nba.com/data/5s/json/cms/noseason/scoreboard/' + GameDate + '/games.json';
        let GameGeneralUrl = 'dataProxy/data/5s/json/cms/noseason/scoreboard/' + '20151125' + '/games.json';
        return this.http.get(GameGeneralUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }
    /**@Param: GameDate, GameID
     * @Example: GameDate => 20151125; GameID => 0021500215 
     */
    GameDetail(GameDate: string, GameID: string): Promise<any> {
        //let GameDetailUrl = 'http://data.nba.com/data/10s/json/cms/noseason/game/' + GameDate + '/' + GameID + '/boxscore.json';
        let GameDetailUrl = 'dataProxy/data/10s/json/cms/noseason/game/' + GameDate + '/' + GameID + '/boxscore.json';
        return this.http.get(GameDetailUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }
    /**@Param: Year
     * @Example: Year => 2015
     */
    LeagueStanding(Year: string): Promise<any> {
        //let LeagueStandingUrl = 'http://data.nba.com/data/json/cms/' + Year + '/league/standings.json';
        let LeagueStandingUrl = 'dataProxy/data/json/cms/' + Year + '/league/standings.json';
        return this.http.get(LeagueStandingUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }
    /**@Param: Season
     * @Example: Season => 2015-16
     */
    PlayerList(Season: string): Promise<any> {
        //let PlayerListUrl = 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=' + Season;
        let PlayerListUrl = 'statsProxy/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=' + Season;
        return this.http.get(PlayerListUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }
    /**@Param: PlayerID
     * @Example: PlayerID => 201939
     */
    PlayerInfo(PlayerID: string): Promise<any> {
        //let PlayerInfoUrl = 'http://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID=' + PlayerID + '&SeasonType=Regular+Season';
        let PlayerInfoUrl = 'statsProxy/stats/commonplayerinfo?LeagueID=00&PlayerID=' + PlayerID + '&SeasonType=Regular+Season';
        return this.http.get(PlayerInfoUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }
    /**@Param: PlayerID, Season
     * @Example: PlayerID => 201939; Season => 2015-16
     */
    PlayerLog(PlayerID: string, Season: string): Promise<any> {
        //let PlayerLogUrl = 'http://stats.nba.com/stats/playergamelog?LeagueID=00&PerMode=PerGame&PlayerID=' + PlayerID + '&Season=' + Season + '&SeasonType=Regular+Season';
        let PlayerLogUrl = 'statsProxy/stats/playergamelog?LeagueID=00&PerMode=PerGame&PlayerID=' + PlayerID + '&Season=' + Season + '&SeasonType=Regular+Season';
        return this.http.get(PlayerLogUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }
    /**@Param: TeamID, Season
     * @Example: TeamID => 1610612744; Season => 2015-16
     */
    TeamInfo(TeamID: string, Season: string): Promise<any> {
        //let TeamInfoUrl = 'http://stats.nba.com/stats/teaminfocommon?LeagueID=00&SeasonType=Regular+Season&TeamID=' + TeamID + '&season=' + Season;
        let TeamInfoUrl = 'statsProxy/stats/teaminfocommon?LeagueID=00&SeasonType=Regular+Season&TeamID=' + TeamID + '&season=' + Season;
        return this.http.get(TeamInfoUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }
    /**@Param: Season, TeamID
     * @Example: Season => 2015-16; TeamID => 1610612744
     */
    TeamDetail(Season: string, TeamID: string): Promise<any> {
        //let TeamDetailUrl = 'http://stats.nba.com/stats/teamplayerdashboard?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=' + Season + '&SeasonSegment=&SeasonType=Regular+Season&TeamID=' + TeamID + '&VsConference=&VsDivision=';
        let TeamDetailUrl = 'statsProxy/stats/teamplayerdashboard?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=' + Season + '&SeasonSegment=&SeasonType=Regular+Season&TeamID=' + TeamID + '&VsConference=&VsDivision=';
        return this.http.get(TeamDetailUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }
    /**@Param: Season, TeamID
     * @Example: Season => 2015-16; TeamID => 1610612744
     */
    TeamDetailBasic(Season: string, TeamID: string): Promise<any> {
        //let TeamDetailBasicUrl = 'http://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=' + Season + '&TeamID=' + TeamID;
        let TeamDetailBasicUrl = 'statsProxy/stats/commonteamroster?LeagueID=00&Season=' + Season + '&TeamID=' + TeamID;
        return this.http.get(TeamDetailBasicUrl).toPromise().then(response => response.json()).catch(this.handleError);
    }    

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}