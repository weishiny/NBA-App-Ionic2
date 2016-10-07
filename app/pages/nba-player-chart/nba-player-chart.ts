import { Component, OnInit, Input } from '@angular/core';
import { CHART_DIRECTIVES } from 'ng2-charts/ng2-charts';
import { NBADataServices } from '../../services/nba-data-services/nba-data-services';

@Component({
  selector: 'nba-player-chart',
  templateUrl: 'build/pages/nba-player-chart/nba-player-chart.html',  
  directives: [CHART_DIRECTIVES]
})
export class PlayerChartComponent implements OnInit{
    @Input() BindingplayerID: string;
    @Input() Bindingcolor: string;
    @Input() Bindingyear: string;
    
    GameLogChartLabels: string[] = ['Points', 'Assists', 'Rebounds', 'Blocks', 'Steals', 'Turnovers'];
    GameLogChartData: any[] = [{data: [0, 0, 0, 0, 0, 0], label: 'default'}]; //default value to avoid error 
    GameLogChartType: string = 'radar';
    GameLogChartTypeCount: number = 1;
    PlusMinusChartLabels: string[] = [];
    PlusMinusChartData: any[] = [{data: [], label: 'default'}]; //default value to avoid error 
    PlusMinusChartType: string = 'bar';
    PlusMinusColors: any[];    

    constructor(private NBAdataservices: NBADataServices) {

    }

    ngOnInit() {                   
        let nowYearlastTwoChar: string =  (parseInt(this.Bindingyear, 10) + 1).toString().substr(2, 2); //ex: 16
        let season: string = this.Bindingyear + '-' + nowYearlastTwoChar; 
        this.GetNBAPlayerLog(this.BindingplayerID, season)
            .then((EachGameLog) => {
                //Get newest 3 games record recently if there are more than 3 games
                //Otherwise, we just get the whole games so far.
                this.GameLogChartData.length = 0;
                let NBAPlayerEachGameLog: any[];
                if(EachGameLog.length >= 3) {
                    NBAPlayerEachGameLog = EachGameLog.slice(0, 3);
                } else {
                    NBAPlayerEachGameLog = EachGameLog.slice(0);
                }                
                
                //Get newest 20 games plus-minus record recently if there are more than 20 games
                //Otherwise, we just get the whole games so far.
                this.PlusMinusChartData.length = 0;
                let NBAPlayerPlusMinusLog: any[];
                if(EachGameLog.length >= 20) {
                    NBAPlayerPlusMinusLog = EachGameLog.slice(0, 20);
                } else {
                    NBAPlayerPlusMinusLog = EachGameLog.slice(0);
                }                         

                let chartGameLogArray: any[] = [];
                let chartGamePlusMinusArray: any[] = [];
                
                NBAPlayerEachGameLog.forEach((gameLog, index) => {
                    //we have 3 series, so we need to generate 3 object reference and push it to array, 
                    //the object is different for every loop by gameLog, the array will have 3 different object 
                    let chartDataObject: {} = { data: [] };                     
                    let Pts = gameLog['Pts'];
                    let Ast = gameLog['Ast'];
                    let Reb = gameLog['Reb'];
                    let Blk = gameLog['Blk'];
                    let Stl = gameLog['Stl'];
                    let Tov = gameLog['Tov'];                    
                    let statArray: any[] = [Pts, Ast, Reb, Blk, Stl, Tov];
                    
                    //we use ES6 Spread Operator (...) so that we can expand each element inside array.
                    //ex: 
                    //let cold = ['autumn', 'winter'];  
                    //let warm = ['spring', 'summer'];  
                    //construct an array
                    //[...cold, ...warm] // => ['autumn', 'winter', 'spring', 'summer'] 
                    chartDataObject['data'].push(...statArray);
                    chartDataObject['label'] = gameLog['GameDate'];
                    chartGameLogArray.push(chartDataObject);
                });

                let chartPlusMinusDataObject: {} = { data: [] };
                NBAPlayerPlusMinusLog.forEach((plusminusRecord, index) => {
                    //we have only 1 series, so we just need to generate 1 object reference and push it to array one time.                    
                    chartPlusMinusDataObject['data'].push(plusminusRecord['PlusMinus']);
                    this.PlusMinusChartLabels.push(plusminusRecord['GameDate']);                    
                });
                chartPlusMinusDataObject['label'] = '+/-';
                chartGamePlusMinusArray.push(chartPlusMinusDataObject);  
                console.log(chartGamePlusMinusArray);
                //Use Array.slice to return a new array so as to force ng2-chart can be refresh.
                //Angular 2 Change Detection only runs when value or reference changes.
                //So we must manually trigger the change detection like the ways that give a different reference.
                this.GameLogChartData = chartGameLogArray.slice();
                this.PlusMinusColors =  [{backgroundColor: this.Bindingcolor}];                
                this.PlusMinusChartData = chartGamePlusMinusArray.slice();                                
            }).catch(this.handleError);                                                     
    }

    private onChangeChartType(): void {
        let chartTypeDef: string[] = ['radar', 'line', 'bar'];                
        this.GameLogChartType = chartTypeDef[this.GameLogChartTypeCount++ % chartTypeDef.length];
    }

    private GetNBAPlayerLog(PlayerID: string, season: string): Promise<any> {
        return this.NBAdataservices.GetPlayerLog(PlayerID, season)
                    .then(playerEachGameLog => playerEachGameLog.slice())
                    .catch(this.handleError);    
    }      

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    // events
    public GameLogchartClicked(e:any): void {
        console.log(e);                
    }

    public GameLogchartHovered(e:any): void {
        console.log(e);
    }

    // events
    public PlusMinuschartClicked(e:any): void {
        console.log(e);                
    }

    public PlusMinuschartHovered(e:any): void {
        console.log(e);
    }
}