//    ./同層目錄; ../上一層目錄; ../../上兩層目錄
import { Injectable } from '@angular/core';
import { NBADataAddress } from './nba-data-address';
import { NBATeamDataType } from '../../base-data-type/nba-team-datatype';
import { NBATeamMap } from '../nba-team-map/nba-team-map';

@Injectable()
export class NBADataServices {

    constructor(private NBAdataaddress: NBADataAddress, private NBAteammap: NBATeamMap) {

    }
    /**@Param: GameDate
     * @Example: GameDate => 20151125
     * @Return: {unstart: [], live: [], over: []} 
     */
    GetGameGeneral(GameDate: string): Promise<any> {
        return this.NBAdataaddress.GameGeneral(GameDate)
                   .then(OriginalData => {                       
                       console.log('**NBA Data Services: Original NBA GameGeneral Data**');
                       console.log(OriginalData);                               
                       /* Logic for Parsed Data */
                       
                       let result: {} = { unstart: [], live: [], over: [] };
                       let item: {};

                       //get Object method: 1. obj['AttrName'] 2. obj.AttrName
                       let gameArray: any[] = OriginalData['sports_content']['games']['game'];
                       gameArray.forEach((EachGame, index) => {
                           item = {
                               gameID: EachGame.id,
                               gameDate: EachGame.date,
                               home: {},
                               visitor: {},
                               Detail: { Loaded: false, Data: {} }
                           };
                           /* Get home and visitor object's id, team_key and score value */
                           const sides: any[] = ['home', 'visitor'];
                           sides.forEach(sideKey => {                               
                               item[sideKey]['TeamID'] = EachGame[sideKey]['id'];
                               item[sideKey]['TeamAbbr'] = EachGame[sideKey]['team_key'];
                               item[sideKey]['Score'] = EachGame[sideKey]['score'];
                           });
                           /* Get game status to check whether game is unstart, live or over, and detail Qtr */
                           const process: {} = EachGame['period_time'];
                           switch(parseInt(process['game_status'], 10)) {
                               case 1: //unstart
                                   item['GameProcessType'] = 'unstart';
                                   item['GameDate'] = process['period_status'];
                                   
                                   result['unstart'].push(item);
                                   break;
                               case 2: //live
                                   item['GameProcessType'] = 'live';
                                   let game_clock: string;
                                   if(process['game_clock']) {
                                       //smaller than 10, we append 0 on left side of number
                                       game_clock = parseInt(process['game_clock'].split(':')[0], 10) < 10 ? '0' + process['game_clock'] : process['game_clock'];
                                   }
                                   item['process'] = {
                                       Time: game_clock || 'End',
                                       Quarter: 'Q' + process['period_value']
                                   }

                                   result['live'].push(item);
                                   break;
                               case 3: //over
                                   item['GameProcessType'] = 'over';

                                   result['over'].push(item);
                                   break;
                               default:
                                   return; 
                           }
                       });                       
                       return result;                                              
                   })
                   .catch(this.handleError);
    }
    /**@Param: GameDate, GameID
     * @Example: GameDate => 20151125; GameID => 0021500215
     * @Return: {GameProcessType, home: {Players: {Array}, TeamAbbr, Score}, visitor: {Players: {Array}, TeamAbbr, Score}, process: {Time, Quarter}} 
     */
    GetGameDetail(GameDate: string, GameID: string): Promise<any> {
        return this.NBAdataaddress.GameDetail(GameDate, GameID)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA GameDetail Data**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */

                       const gameObject: {} = OriginalData['sports_content']['game'];
                       let result: {} = { home: {}, visitor: {} };
                        
                       //Object.keys() returns an array whose elements are strings corresponding to the enumerable properties 
                       //found directly upon object. The ordering of the properties is the same as that given by looping over 
                       //the properties of the object manually.
                       //Example: var obj = { 0: 'a', 1: 'b', 2: 'c' };
                       //         console.log(Object.keys(obj)); // console: ['0', '1', '2']
                       //So, Object.keys(result) will return an array contain 'home' and 'visitor'
                       //Object.keys({ home: {}, visitor: {} }) = const sides: any[] = ['home', 'visitor'];                           
                       Object.keys(result).forEach(sideKey => {
                           result[sideKey]['TeamAbbr'] = gameObject[sideKey]['team_key'];
                           result[sideKey]['Score'] = gameObject[sideKey]['score'];
                           result[sideKey]['Players'] = gameObject[sideKey]['players']['player']; //player is an array
                       });
                       const gameType = parseInt(gameObject['period_time']['game_status'], 10)
                       result['GameProcessType'] = gameType === 3 ? 'over' : (gameType === 2 ? 'live' : 'unstart')

                       if (result['GameProcessType'] === 'live') {
                           const process = gameObject['period_time'];
                           result['process'] = {
                               Time: process['game_clock'] || 'End',
                               Quarter: 'Q' + process['period_value']
                           }
                       }                       
                       return result;
                   })
                   .catch(this.handleError);
    }
    /**@Param: Year
     * @Example: Year => 2015
     * @Return: {TeamID: { TeamAbbr, TeamStats:{} }}
     */
    GetLeagueStanding(Year: string): Promise<any> {
        return this.NBAdataaddress.LeagueStanding(Year)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA LeagueStanding Data**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */

                       //const teamArray: any[] = OriginalData.sports_content.standings.team;
                       const teamArray: any[] = OriginalData['sports_content']['standings']['team'];
                       let result: {} = {};
                       teamArray.forEach(EachTeam => {
                           result[EachTeam.id] = result[EachTeam.id] || {}; //create an object whose attribute is TeamID
                           result[EachTeam.id]['TeamAbbr'] = EachTeam['abbreviation'];
                           result[EachTeam.id]['TeamStats'] = EachTeam['team_stats']; //team_stats is an object
                       });                       
                       return result;                               
                   })
                   .catch(this.handleError);
    }
    /**@Param: Season
     * @Example: Season => 2015-16
     * @Return: [{FirstName, LastName, Name, PlayerID, TeamId, TeamCity, TeamName, TeamAbbr}]
     */
    GetPlayerList(Season: string): Promise<any> {
        return this.NBAdataaddress.PlayerList(Season)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA PlayerList Data**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */

                       //const data = res.resultSets[0].rowSet;
                       const MetadataArray: any[] = OriginalData['resultSets'][0]['headers'];
                       console.log('**NBA Data Services: Original NBA PlayerList MetaData**');
                       console.log(MetadataArray);
                       const PlayerListArray: any[] = OriginalData['resultSets'][0]['rowSet'];
                       /* Handle season year, the new season start from October*/
                       /* 2015.10-2016.9 is 2015-16 season; 2016.10-2017.9 is 2016-17 season */
                       const currentDate: Date = new Date();
                       const currentMonth: number = currentDate.getMonth() + 1;                       
                       let currentYear: string;                       
                       if (currentMonth >= 10) {
                           currentYear = currentDate.getFullYear() + '';
                       } else {
                           //Game before September is former season
                           //currentYear = currentDate.getFullYear() - 1 + '';
                           currentYear = '2016'; //Test
                       }

                       let nameArray: any[];
                       //The map() method creates a new array with the results of calling a provided function on every element in this array.
                       return PlayerListArray.filter(item => {
                           return item[5] === currentYear; //TO_YEAR is indicate that the player is still on court in current year
                       }).map(matchitem => {
                               nameArray = matchitem[1].split(', '); //"DISPLAY_LAST_COMMA_FIRST": Curry, Stephen => [0]:Curry, [1]:Stephen
                               return {
                                   PlayerID: matchitem[0],
                                   FirstName: nameArray[1], //Stephen
                                   LastName: nameArray[0], //Curry
                                   Name: nameArray[1] + ' ' + nameArray[0],
                                   TeamID: matchitem[7],
                                   TeamCity: matchitem[8],
                                   TeamName: matchitem[9],
                                   TeamAbbr: matchitem[10],
                                   FromYear: matchitem[4],
                                   ToYear: matchitem[5]
                               };
                       });
                    })
                    .catch(this.handleError);
    }
    /**@Param: PlayerID
     * @Example: PlayerID => 201939
     * @Return: {PlayerID:, FirstName, LastName, Pts, Ast, Reb, Team, JerseyNum, Height, Weight, Birthday, Position, Affiliation}
     */
    GetPlayerInfo(PlayerID: string): Promise<any> {
        return this.NBAdataaddress.PlayerInfo(PlayerID)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA Each PlayerInfo Data**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */

                       const basicInfo: any[] = OriginalData['resultSets'][0]['rowSet'][0];
                       const gameInfo: any[] = OriginalData['resultSets'][1]['rowSet'][0];

                       return {
                           PlayerID: basicInfo[0],
                           FirstName: basicInfo[1],
                           LastName: basicInfo[2],
                           Pts: gameInfo[3],
                           Ast: gameInfo[4],
                           Reb: gameInfo[5],
                           Team: basicInfo[18],
                           JerseyNum: basicInfo[13],
                           Height: basicInfo[10],
                           Weight: basicInfo[11],
                           Birthday: basicInfo[6].split('T')[0],
                           Position: basicInfo[14],
                           Affiliation: basicInfo[9]
                       };
                   })
                   .catch(this.handleError);
    }
    /**@Param: PlayerID, Season
     * @Example: PlayerID => 201939; Season => 2015-16
     * @Return: [{GameID, GameDate, Matchup, GameResult, Min, Pts, Fg, FgRate, ThreeP, ThreePRate, Ft, FtRate, Reb, Ast, Stl, Blk, Tov, Foul, PlusMinus}]
     */
    GetPlayerLog(PlayerID: string, Season: string): Promise<any> {
        return this.NBAdataaddress.PlayerLog(PlayerID, Season)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA PlayerLog Data**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */

                       const logsArray: any[] = OriginalData['resultSets'][0]['rowSet'];
                       const MetadataArray: any[] = OriginalData['resultSets'][0]['headers'];
                       console.log('**NBA Data Services: Original NBA PlayerLog MetaData**');
                       console.log(MetadataArray);
                       return logsArray.map(item => {
                           return {
                               GameID: item[2],
                               GameDate: item[3],
                               Matchup: item[4],
                               GameResult: item[5],
                               Min: item[6],
                               Pts: item[24],
                               Fg: item[7] + '-' + item[8],
                               FgRate: item[9],
                               ThreeP: item[10] + '-' + item[11],
                               ThreePRate: item[12],
                               Ft: item[13] + '-' + item[14],
                               FtRate: item[15],
                               Reb: item[18],
                               Ast: item[19],
                               Stl: item[20],
                               Blk: item[21],
                               Tov: item[22],
                               Foul: item[23],
                               PlusMinus: item[25]
                           };
                       });
                   })
                   .catch(this.handleError);
    }
    /**Because http://stats.nba.com/stats/scoreboard Web Api is 'Access Denied', So we use Web Api of 
     * LeagueStanding in nba-data-address.ts, use LeagueStanding will get team id, and standing 
     * is total standing instead of division standing. Also, it's in order of Array, i.e. team of Array[0] is 
     * ranked first. Afterwards, we make each team abbreviation as the parameter to match NBATeamMap to judge 
     * whether the team is East or West. Finally, we push team into eastern and western array according to 
     * NBATeamMap's Abbr Attribute. 
     * @Param: Year
     * @Example: Year => 2015
     * @Return {eastern: [{TeamID, TeamAbbr, TeamConf, Win, Loss, PCT}], western:[{TeamID, TeamAbbr, TeamConf, Win, Loss, PCT}]}
     */
    GetTeamRank(Year: string): Promise<any> {
        return this.NBAdataaddress.LeagueStanding(Year)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA TeamRank Data => LeagueStanding Api**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */
                      
                       const teamArray: any[] = OriginalData['sports_content']['standings']['team'];
                       let teamStatsObject: {};                       
                       let eastern: any[] = [];
                       let western: any[] = [];
                       teamArray.forEach(EachTeam => {                                                      
                           teamStatsObject = EachTeam['team_stats']; //team_stats is an object                        
                           let teamMapArray: NBATeamDataType[] = this.NBAteammap.getNBATeamArrayData();
                           let teamFilteredArray: NBATeamDataType[] = teamMapArray.filter(item => item['id'] === EachTeam['id']);
                           let LocalData: {} = {                                             
                               TeamID: EachTeam['id'],
                               TeamAbbr: EachTeam['abbreviation'],
                               TeamConf: teamFilteredArray[0]['Conference'], //use id as condition so we can only get an array contain only one object                                              
                               Win: teamStatsObject['wins'],
                               Loss: teamStatsObject['losses'],
                               PCT: teamStatsObject['pct']                        
                           };
                           if(LocalData['TeamConf'] === 'Eastern') {
                               eastern.push(LocalData);
                           } else {
                               western.push(LocalData);
                           }                           
                       });
                       console.log({eastern, western});
                       return {eastern, western};
                   })
                   .catch(this.handleError);
    }
    /**@Param: TeamID, Season
     * @Example: TeamID => 1610612744; Season => 2015-16
     * @Return: {TeamCity, TeamName, TeamAbbr, TeamConf, TeamDivi, ConfRank, DiviRank, Win, Loss, TeamID, PtsRank, RebRank, AstRank, OppRank}
     */
    GetTeamInfo(TeamID: string, Season: string): Promise<any> {
        return this.NBAdataaddress.TeamInfo(TeamID, Season)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA TeamInfo Data**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */

                       const teamInfoArray: any[] = OriginalData['resultSets'][0]['rowSet'][0];
                       const seasonRankArray: any[] = OriginalData['resultSets'][1]['rowSet'][0];

                       return {
                           TeamCity: teamInfoArray[2],
                           TeamName: teamInfoArray[3],
                           TeamAbbr: teamInfoArray[4],
                           TeamConf: teamInfoArray[5],
                           TeamDivi: teamInfoArray[6],
                           ConfRank: teamInfoArray[11],
                           DiviRank: teamInfoArray[12],
                           Win: teamInfoArray[8],
                           Loss: teamInfoArray[9],
                           TeamID: teamInfoArray[0],
                           PtsRank: seasonRankArray[3],
                           RebRank: seasonRankArray[5],
                           AstRank: seasonRankArray[7],
                           OppRank: seasonRankArray[9]
                       };
                   })
                   .catch(this.handleError);
    }
    /**@Param: Season, TeamID
     * @Example: Season => 2015-16; TeamID => 1610612744
     * @Return: [{PlayerID, Name, Gp, Pts, Reb, Ast, Min}]
     */
    GetTeamDetail(Season: string, TeamID: string): Promise<any> {
        return this.NBAdataaddress.TeamDetail(Season, TeamID)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA TeamDetail Data**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */

                       const target: any[] = OriginalData['resultSets'][1]['rowSet'];
                       return target.map(player => {
                           return {
                               PlayerID: player[1],
                               Name: player[2],
                               Gp: player[3],
                               Pts: player[27],
                               Reb: player[19],
                               Ast: player[20],
                               Min: player[7]
                           };
                        });
                   })
                   .catch(this.handleError);
    }
    /**@Param: Season, TeamID
     * @Example: Season => 2015-16; TeamID => 1610612744
     * @Return: {PlayerID: {Name, Pos, Height, Weight, JerseyNum, Age}}
     */
    GetTeamDetailBasic(Season: string, TeamID: string): Promise<any> {
        return this.NBAdataaddress.TeamDetailBasic(Season, TeamID)
                   .then(OriginalData => {
                       console.log('**NBA Data Services: Original NBA TeamDetailBasic Data**');
                       console.log(OriginalData);
                       /* Logic for Parsed Data */

                       const target = OriginalData['resultSets'][0]['rowSet'];
                       let result: {} = {};
                       target.forEach(player => {
                           result[player[12]] = {
                               Name: player[3],
                               Pos: player[5],
                               Height: player[6],
                               Weight: player[7],
                               JerseyNum: player[4],
                               Age: player[9]
                           };
                       })
                       return result;
                   })
                   .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {        
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}