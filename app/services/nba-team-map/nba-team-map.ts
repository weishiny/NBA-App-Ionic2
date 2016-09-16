import { Injectable } from '@angular/core';
import { NBATeamDataType } from '../../base-data-type/nba-team-datatype';

@Injectable()
export class NBATeamMap {

    private _data: NBATeamDataType[] = [
        { id: '1610612738', Conference: 'Eastern', Division: 'ATLANTIC', City: 'Boston', Team: 'Celtics', Abbreviation: 'BOS', Color: '#008348', imgUrl: 'img/Celtics.gif' },
        { id: '1610612751', Conference: 'Eastern', Division: 'ATLANTIC', City: 'Brooklyn', Team: 'Nets', Abbreviation: 'BKN', Color: '#000', imgUrl: 'img/Nets.gif' },
        { id: '1610612752', Conference: 'Eastern', Division: 'ATLANTIC', City: 'New York', Team: 'Knicks', Abbreviation: 'NYK', Color: '#F58426', imgUrl: 'img/Knicks.gif' },
        { id: '1610612755', Conference: 'Eastern', Division: 'ATLANTIC', City: 'Philadelphia', Team: '76ers', Abbreviation: 'PHI', Color: '#006BB6', imgUrl: 'img/76ers.gif' },
        { id: '1610612761', Conference: 'Eastern', Division: 'ATLANTIC', City: 'Toronto', Team: 'Raptors', Abbreviation: 'TOR', Color: '#CE1141', imgUrl: 'img/Raptors.gif' },
        { id: '1610612741', Conference: 'Eastern', Division: 'CENTRAL', City: 'Chicago', Team: 'Bulls', Abbreviation: 'CHI', Color: '#CE1141', imgUrl: 'img/Bulls.gif' },
        { id: '1610612739', Conference: 'Eastern', Division: 'CENTRAL', City: 'Cleveland', Team: 'Cavaliers', Abbreviation: 'CLE', Color: '#860038', imgUrl: 'img/Cavaliers.gif' },
        { id: '1610612765', Conference: 'Eastern', Division: 'CENTRAL', City: 'Detroit', Team: 'Pistons', Abbreviation: 'DET', Color: '#006BB6', imgUrl: 'img/Pistons.gif' },
        { id: '1610612754', Conference: 'Eastern', Division: 'CENTRAL', City: 'Indiana', Team: 'Pacers', Abbreviation: 'IND', Color: '#FFC633', imgUrl: 'img/Pacers.gif' },
        { id: '1610612749', Conference: 'Eastern', Division: 'CENTRAL', City: 'Milwaukee', Team: 'Bucks', Abbreviation: 'MIL', Color: '#00471B', imgUrl: 'img/Bucks.gif' },
        { id: '1610612737', Conference: 'Eastern', Division: 'SOUTHEAST', City: 'Atlanta', Team: 'Hawks', Abbreviation: 'ATL', Color: '#E03A3E', imgUrl: 'img/Hawks.gif' },
        { id: '1610612766', Conference: 'Eastern', Division: 'SOUTHEAST', City: 'Charlotte', Team: 'Hornets', Abbreviation: 'CHA', Color: '#008CA8', imgUrl: 'img/Hornets.gif' },
        { id: '1610612748', Conference: 'Eastern', Division: 'SOUTHEAST', City: 'Miami', Team: 'Heat', Abbreviation: 'MIA', Color: '#98002E', imgUrl: 'img/Heat.gif' },
        { id: '1610612753', Conference: 'Eastern', Division: 'SOUTHEAST', City: 'Orlando', Team: 'Magic', Abbreviation: 'ORL', Color: '#007DC5', imgUrl: 'img/Magic.gif' },
        { id: '1610612764', Conference: 'Eastern', Division: 'SOUTHEAST', City: 'Washington', Team: 'Wizards', Abbreviation: 'WAS', Color: '#F5002F', imgUrl: 'img/Wizards.gif' },
        
        { id: '1610612742', Conference: 'Western', Division: 'SOUTHWEST', City: 'Dallas', Team: 'Mavericks', Abbreviation: 'DAL', Color: '#007DC5', imgUrl: 'img/Mavericks.gif' },
        { id: '1610612745', Conference: 'Western', Division: 'SOUTHWEST', City: 'Houston', Team: 'Rockets', Abbreviation: 'HOU', Color: '#CE1141', imgUrl: 'img/Rockets.gif' },
        { id: '1610612763', Conference: 'Western', Division: 'SOUTHWEST', City: 'Memphis', Team: 'Grizzlies', Abbreviation: 'MEM', Color: '#6189B9', imgUrl: 'img/Grizzlies.gif' },
        { id: '1610612740', Conference: 'Western', Division: 'SOUTHWEST', City: 'New Orleans', Team: 'Pelicans', Abbreviation: 'NOP', Color: '#002B5C', imgUrl: 'img/Pelicans.gif' },
        { id: '1610612759', Conference: 'Western', Division: 'SOUTHWEST', City: 'San Antonio', Team: 'Spurs', Abbreviation: 'SAS', Color: '#B6BFBF', imgUrl: 'img/Spurs.gif' },
        { id: '1610612743', Conference: 'Western', Division: 'NORTHWEST', City: 'Denver', Team: 'Nuggets', Abbreviation: 'DEN', Color: '#FFB20F', imgUrl: 'img/Nuggets.gif' },
        { id: '1610612750', Conference: 'Western', Division: 'NORTHWEST', City: 'Minnesota', Team: 'Timberwolves', Abbreviation: 'MIN', Color: '#005083', imgUrl: 'img/Timberwolves.gif' },
        { id: '1610612760', Conference: 'Western', Division: 'NORTHWEST', City: 'Oklahoma City', Team: 'Thunder', Abbreviation: 'OKC', Color: '#F05133', imgUrl: 'img/Thunder.gif' },
        { id: '1610612757', Conference: 'Western', Division: 'NORTHWEST', City: 'Portland', Team: 'TrailBlazers', Abbreviation: 'POR', Color: '#000', imgUrl: 'img/TrailBlazers.gif' },
        { id: '1610612762', Conference: 'Western', Division: 'NORTHWEST', City: 'Utah', Team: 'Jazz', Abbreviation: 'UTA', Color: '#00471B', imgUrl: 'img/Jazz.gif' },
        { id: '1610612744', Conference: 'Western', Division: 'PACIFIC', City: 'Golden State', Team: 'Warriors', Abbreviation: 'GSW', Color: '#FDB927', imgUrl: 'img/Warriors.gif' },
        { id: '1610612746', Conference: 'Western', Division: 'PACIFIC', City: 'Los Angeles', Team: 'Clippers', Abbreviation: 'LAC', Color: '#222', imgUrl: 'img/Clippers.gif' },
        { id: '1610612747', Conference: 'Western', Division: 'PACIFIC', City: 'Los Angeles', Team: 'Lakers', Abbreviation: 'LAL', Color: '#552582', imgUrl: 'img/Lakers.gif' },
        { id: '1610612756', Conference: 'Western', Division: 'PACIFIC', City: 'Phoenix', Team: 'Suns', Abbreviation: 'PHX', Color: '#E56020', imgUrl: 'img/Suns.gif' },
        { id: '1610612758', Conference: 'Western', Division: 'PACIFIC', City: 'Sacramento', Team: 'Kings', Abbreviation: 'SAC', Color: '#724C9F', imgUrl: 'img/Kings.gif' }
    ];

    constructor() {

    }
    /**
     * Get NBA Map Data Array
     */
    getNBATeamArrayData(): NBATeamDataType[] {
        return this._data;
    }

    getAsyncNBATeamData(): Promise<NBATeamDataType[]> {
        return new Promise<NBATeamDataType[]>(resolve => { 
            setTimeout(() => {
                resolve(this.getNBATeamData());
            }, 1000);
        });
    }
    getNBATeamData(): NBATeamDataType[] {
        let arrdata: NBATeamDataType[] = [];
        for (var i = 0; i < 3; i++) {
            console.log('**Start to load NBA Team Item**');
            arrdata.push(this.getRandomData());
        }
        return arrdata;
    }
    private getRandomData(): NBATeamDataType {
        let i = Math.floor( Math.random() * this._data.length );
        return this._data[i]; //will return MockDataType instead of MockDataType[]
    }
}
