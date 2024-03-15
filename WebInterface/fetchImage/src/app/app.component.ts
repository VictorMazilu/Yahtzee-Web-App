import { Component } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { WebcamImage } from 'ngx-webcam';
import { prodEnvironment } from '../config/environment.prod';
import TokenStore from './session/token';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

interface PlayerScore {
  playerName: string;
  onesJ: number;
  onesL: number;
  onesS: number;
  twosJ: number;
  twosL: number;
  twosS: number;
  threesJ: number;
  threesL: number;
  threesS: number;
  foursJ: number;
  foursL: number;
  foursS: number;
  fivesJ: number;
  fivesL: number;
  fivesS: number;
  sixesJ: number;
  sixesL: number;
  sixesS: number;
  totalJ: number;
  totalL: number;
  totalS: number;
  doubleJ: number;
  doubleL: number;
  doubleS: number;
  onepointJ: number;
  onepointL: number;
  onepointS: number;
  twopointsJ: number;
  twopointsL: number;
  twopointsS: number;
  threepcsJ: number;
  threepcsL: number;
  threepcsS: number;
  quintaJ: number;
  quintaL: number;
  quintaS: number;
  fullJ: number;
  fullL: number;
  fullS: number;
  kareuJ: number;
  kareuL: number;
  kareuS: number;
  yamsJ: number;
  yamsL: number;
  yamsS: number;
  maxJ: number;
  maxL: number;
  maxS: number;
  minJ: number;
  minL: number;
  minS: number;
  diffJ: number;
  diffL: number;
  diffS: number;
  totalFinalJ: number;
  totalFinalL: number;
  totalFinalS: number;
  grandTotalJ: number;
  grandTotalL: number;
  grandTotalS: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public returnedImage: any;
  public userLoggedIn = false;

  private trigger: Subject<any> = new Subject();
  public dices: any;

  public webcamImage!: WebcamImage;
  private nextWebcam: Subject<any> = new Subject();

  dataMap: { [key: number]: number } = {};

  public player1: PlayerScore = { onepointJ: -1, onepointL: -1, onepointS: -1, twopointsJ: -1, twopointsL: -1, twopointsS: -1, threepcsJ: -1, threepcsL: -1, threepcsS: -1, quintaJ: -1, quintaL: -1, quintaS: -1, fullJ: -1, fullL: -1, fullS: -1, kareuJ: -1, kareuL: -1, kareuS: -1, yamsJ: -1, yamsL: -1, yamsS: -1, maxJ: -1, maxL: -1, maxS: -1, minJ: -1, minL: -1, minS: -1, diffJ: 0, diffL: 0, diffS: 0, grandTotalJ: 0, grandTotalL: 0, grandTotalS: 0, playerName: '', onesJ: -1, onesL: -1, onesS: -1, twosJ: -1, twosL: -1, twosS: -1, threesJ: -1, threesL: -1, threesS: -1, foursJ: -1, foursL: -1, foursS: -1, fivesJ: -1, fivesL: -1, fivesS: -1, sixesJ: -1, sixesL: -1, sixesS: -1, totalJ: 0, totalL: 0, totalS: 0, doubleJ: 0, doubleL: 0, doubleS: 0, totalFinalJ: 0, totalFinalL: 0, totalFinalS: 0 };
  public player2: PlayerScore = { onepointJ: -1, onepointL: -1, onepointS: -1, twopointsJ: -1, twopointsL: -1, twopointsS: -1, threepcsJ: -1, threepcsL: -1, threepcsS: -1, quintaJ: -1, quintaL: -1, quintaS: -1, fullJ: -1, fullL: -1, fullS: -1, kareuJ: -1, kareuL: -1, kareuS: -1, yamsJ: -1, yamsL: -1, yamsS: -1, maxJ: -1, maxL: -1, maxS: -1, minJ: -1, minL: -1, minS: -1, diffJ: 0, diffL: 0, diffS: 0, grandTotalJ: 0, grandTotalL: 0, grandTotalS: 0, playerName: '', onesJ: -1, onesL: -1, onesS: -1, twosJ: -1, twosL: -1, twosS: -1, threesJ: -1, threesL: -1, threesS: -1, foursJ: -1, foursL: -1, foursS: -1, fivesJ: -1, fivesL: -1, fivesS: -1, sixesJ: -1, sixesL: -1, sixesS: -1, totalJ: 0, totalL: 0, totalS: 0, doubleJ: 0, doubleL: 0, doubleS: 0, totalFinalJ: 0, totalFinalL: 0, totalFinalS: 0 };
  public player3: PlayerScore = { onepointJ: -1, onepointL: -1, onepointS: -1, twopointsJ: -1, twopointsL: -1, twopointsS: -1, threepcsJ: -1, threepcsL: -1, threepcsS: -1, quintaJ: -1, quintaL: -1, quintaS: -1, fullJ: -1, fullL: -1, fullS: -1, kareuJ: -1, kareuL: -1, kareuS: -1, yamsJ: -1, yamsL: -1, yamsS: -1, maxJ: -1, maxL: -1, maxS: -1, minJ: -1, minL: -1, minS: -1, diffJ: 0, diffL: 0, diffS: 0, grandTotalJ: 0, grandTotalL: 0, grandTotalS: 0, playerName: '', onesJ: -1, onesL: -1, onesS: -1, twosJ: -1, twosL: -1, twosS: -1, threesJ: -1, threesL: -1, threesS: -1, foursJ: -1, foursL: -1, foursS: -1, fivesJ: -1, fivesL: -1, fivesS: -1, sixesJ: -1, sixesL: -1, sixesS: -1, totalJ: 0, totalL: 0, totalS: 0, doubleJ: 0, doubleL: 0, doubleS: 0, totalFinalJ: 0, totalFinalL: 0, totalFinalS: 0 };
  public player4: PlayerScore = { onepointJ: -1, onepointL: -1, onepointS: -1, twopointsJ: -1, twopointsL: -1, twopointsS: -1, threepcsJ: -1, threepcsL: -1, threepcsS: -1, quintaJ: -1, quintaL: -1, quintaS: -1, fullJ: -1, fullL: -1, fullS: -1, kareuJ: -1, kareuL: -1, kareuS: -1, yamsJ: -1, yamsL: -1, yamsS: -1, maxJ: -1, maxL: -1, maxS: -1, minJ: -1, minL: -1, minS: -1, diffJ: 0, diffL: 0, diffS: 0, grandTotalJ: 0, grandTotalL: 0, grandTotalS: 0, playerName: '', onesJ: -1, onesL: -1, onesS: -1, twosJ: -1, twosL: -1, twosS: -1, threesJ: -1, threesL: -1, threesS: -1, foursJ: -1, foursL: -1, foursS: -1, fivesJ: -1, fivesL: -1, fivesS: -1, sixesJ: -1, sixesL: -1, sixesS: -1, totalJ: 0, totalL: 0, totalS: 0, doubleJ: 0, doubleL: 0, doubleS: 0, totalFinalJ: 0, totalFinalL: 0, totalFinalS: 0 };

  public players: PlayerScore[] = [this.player1, this.player2, this.player3, this.player4];

  captureImage = '';
  constructor(private http: HttpClient) { }
  ngOnInit() {
  }
  receiveMessage(logged: boolean) {
    this.userLoggedIn = logged;
  }

  computeTotals() {
    for (let i = 0; i < 4; i++) {
      this.players[i].totalJ =
        (
          (this.players[i].onesJ !== -1 ? this.players[i].onesJ : 0) +
          (this.players[i].twosJ !== -1 ? this.players[i].twosJ : 0) +
          (this.players[i].threesJ !== -1 ? this.players[i].threesJ : 0) +
          (this.players[i].foursJ !== -1 ? this.players[i].foursJ : 0) +
          (this.players[i].fivesJ !== -1 ? this.players[i].fivesJ : 0) +
          (this.players[i].sixesJ !== -1 ? this.players[i].sixesJ : 0)
        );
      this.players[i].totalL =
        (
          (this.players[i].onesL !== -1 ? this.players[i].onesL : 0) +
          (this.players[i].twosL !== -1 ? this.players[i].twosL : 0) +
          (this.players[i].threesL !== -1 ? this.players[i].threesL : 0) +
          (this.players[i].foursL !== -1 ? this.players[i].foursL : 0) +
          (this.players[i].fivesL !== -1 ? this.players[i].fivesL : 0) +
          (this.players[i].sixesL !== -1 ? this.players[i].sixesL : 0)
        );
      this.players[i].totalS =
        (
          (this.players[i].onesS !== -1 ? this.players[i].onesS : 0) +
          (this.players[i].twosS !== -1 ? this.players[i].twosS : 0) +
          (this.players[i].threesS !== -1 ? this.players[i].threesS : 0) +
          (this.players[i].foursS !== -1 ? this.players[i].foursS : 0) +
          (this.players[i].fivesS !== -1 ? this.players[i].fivesS : 0) +
          (this.players[i].sixesS !== -1 ? this.players[i].sixesS : 0)
        );

        this.players[i].doubleJ = 
        this.players[i].totalJ >= 60 ? 
        (this.players[i].totalJ !== -1 ? this.players[i].totalJ * 2 : 0) : (this.players[i].totalJ !== 0 ? this.players[i].totalJ : 0);
        this.players[i].doubleL = 
        this.players[i].totalJ >= 60 ? 
        (this.players[i].totalL !== -1 ? this.players[i].totalL * 2 : 0) : (this.players[i].totalL !== 0 ? this.players[i].totalL : 0);
        this.players[i].doubleS =
        this.players[i].totalS >= 60 ? 
        (this.players[i].totalS !== -1 ? this.players[i].totalS * 2 : 0) : (this.players[i].totalS !== 0 ? this.players[i].totalS : 0);



        this.players[i].totalFinalJ = 
        (this.players[i].onepointJ !== -1 ? this.players[i].onepointJ : 0) + 
        (this.players[i].twopointsJ !== -1 ? this.players[i].twopointsJ : 0) + 
        (this.players[i].threepcsJ !== -1 ? this.players[i].threepcsJ : 0) + 
        (this.players[i].quintaJ !== -1 ? this.players[i].quintaJ : 0) + 
        (this.players[i].fullJ !== -1 ? this.players[i].fullJ : 0) + 
        (this.players[i].kareuJ !== -1 ? this.players[i].kareuJ : 0) + 
        (this.players[i].yamsJ !== -1 ? this.players[i].yamsJ : 0) + 
        (this.players[i].diffJ !== -1 ? this.players[i].diffJ : 0) ;
        this.players[i].totalFinalL =
        (this.players[i].onepointL !== -1 ? this.players[i].onepointL : 0) + 
        (this.players[i].twopointsL !== -1 ? this.players[i].twopointsL : 0) + 
        (this.players[i].threepcsL !== -1 ? this.players[i].threepcsL : 0) + 
        (this.players[i].quintaL !== -1 ? this.players[i].quintaL : 0) + 
        (this.players[i].fullL !== -1 ? this.players[i].fullL : 0) + 
        (this.players[i].kareuL !== -1 ? this.players[i].kareuL : 0) + 
        (this.players[i].yamsL !== -1 ? this.players[i].yamsL : 0) +
        (this.players[i].diffL !== -1 ? this.players[i].diffL : 0);
        this.players[i].totalFinalS =
        (this.players[i].onepointS !== -1 ? this.players[i].onepointS : 0) + 
        (this.players[i].twopointsS !== -1 ? this.players[i].twopointsS : 0) + 
        (this.players[i].threepcsS !== -1 ? this.players[i].threepcsS : 0) + 
        (this.players[i].quintaS !== -1 ? this.players[i].quintaS : 0) + 
        (this.players[i].fullS !== -1 ? this.players[i].fullS : 0) + 
        (this.players[i].kareuS !== -1 ? this.players[i].kareuS : 0) + 
        (this.players[i].yamsS !== -1 ? this.players[i].yamsS : 0) +
        (this.players[i].diffS !== -1 ? this.players[i].diffS : 0);

        this.players[i].grandTotalJ = 
        (this.players[i].totalJ !== 0 ? this.players[i].totalJ : 0) + (this.players[i].totalFinalJ !== 0 ? this.players[i].totalFinalJ : 0) +
        (this.players[i].totalL !== 0 ? this.players[i].totalL : 0) + (this.players[i].totalFinalL !== 0 ? this.players[i].totalFinalL : 0) +
        (this.players[i].totalS !== 0 ? this.players[i].totalS : 0) + (this.players[i].totalFinalS !== 0 ? this.players[i].totalFinalS : 0);

console.log("grandj" , this.players[i].grandTotalJ);

        if(this.players[i].minJ !== -1 && this.players[i].maxJ !== -1) {
          this.players[i].diffJ = this.players[i].maxJ - this.players[i].minJ;
        }
        if(this.players[i].minL !== -1 && this.players[i].maxL !== -1) {
          this.players[i].diffL = this.players[i].maxL - this.players[i].minL;
        }
        if(this.players[i].minS !== -1 && this.players[i].maxS !== -1) {
          this.players[i].diffS = this.players[i].maxS - this.players[i].minS;
        }
    }
  }

  computeTable(event: any, player: number, type: string, points: number) {
    let sum = 0;
    for (let i = 0; i < this.dices.length; i++) {
      if (this.dices[i] === 1 && points === 1) {
        sum += 1;
      }
      if (this.dices[i] === 2 && points === 2) {
        sum += 2;
      }
      if (this.dices[i] === 3 && points === 3) {
        sum += 3;
      }
      if (this.dices[i] === 4 && points === 4) {
        sum += 4;
      }
      if (this.dices[i] === 5 && points === 5) {
        sum += 5;
      }
      if (this.dices[i] === 6 && points === 6) {
        sum += 6;
      }
    }
    if(points === 7 || points === 8 || points === 9 || points === 10 || points === 11 || points === 12 || points === 13 || points === 14 || points === 15) {
      for (let i = 0; i < this.dices.length; i++) {
        sum += this.dices[i];
      }
    }
    if (points === 1) {
      if (type === 'J') {
        this.players[player].onesJ = sum;
      }
      if (type === 'L') {
        this.players[player].onesL = sum;
      }
      if (type === 'S') {
        this.players[player].onesS = sum;
      }
    }
    if (points === 2) {
      if (type === 'J') {
        this.players[player].twosJ = sum;
      }
      if (type === 'L') {
        this.players[player].twosL = sum;
      }
      if (type === 'S') {
        this.players[player].twosS = sum;
      }
    }
    if (points === 3) {
      if (type === 'J') {
        this.players[player].threesJ = sum;
      }
      if (type === 'L') {
        this.players[player].threesL = sum;
      }
      if (type === 'S') {
        this.players[player].threesS = sum;
      }
    }
    if (points === 4) {
      if (type === 'J') {
        this.players[player].foursJ = sum;
      }
      if (type === 'L') {
        this.players[player].foursL = sum;
      }
      if (type === 'S') {
        this.players[player].foursS = sum;
      }
    }
    if (points === 5) {
      if (type === 'J') {
        this.players[player].fivesJ = sum;
      }
      if (type === 'L') {
        this.players[player].fivesL = sum;
      }
      if (type === 'S') {
        this.players[player].fivesS = sum;
      }
    }
    if (points === 6) {
      if (type === 'J') {
        this.players[player].sixesJ = sum;
      }
      if (type === 'L') {
        this.players[player].sixesL = sum;
      }
      if (type === 'S') {
        this.players[player].sixesS = sum;
      }
    }
    if (points === 7) {
      if (type === 'J') {
        this.players[player].onepointJ = sum;
      }
      if (type === 'L') {
        this.players[player].onepointL = sum;
      }
      if (type === 'S') {
        this.players[player].onepointS = sum;
      }
    }
    if (points === 8) {
      if (type === 'J') {
        this.players[player].twopointsJ = sum ;
      }
      if (type === 'L') {
        this.players[player].twopointsL = sum ;
      }
      if (type === 'S') {
        this.players[player].twopointsS = sum ;
      }
    }
    if (points === 9) {
      if (type === 'J') {
        this.players[player].threepcsJ = sum + 10;
      }
      if (type === 'L') {
        this.players[player].threepcsL = sum + 10;
      }
      if (type === 'S') {
        this.players[player].threepcsS = sum + 10;
      }
      sum += 10;
    }
    if (points === 10) {
      if (type === 'J') {
        this.players[player].quintaJ = sum + 20;
      }
      if (type === 'L') {
        this.players[player].quintaL = sum + 20;
      }
      if (type === 'S') {
        this.players[player].quintaS = sum + 20;
      }
      sum += 20;
    }
    if (points === 11) {
      if (type === 'J') {
        this.players[player].fullJ = sum + 30;
      }
      if (type === 'L') {
        this.players[player].fullL = sum + 30;
      }
      if (type === 'S') {
        this.players[player].fullS = sum + 30;
      }
      sum += 30;
    }
    if (points === 12) {
      if (type === 'J') {
        this.players[player].kareuJ = sum + 40;
      }
      if (type === 'L') {
        this.players[player].kareuL = sum + 40;
      }
      if (type === 'S') {
        this.players[player].kareuS = sum + 40;
      }
      sum += 40;
    }
    if (points === 13) {
      if (type === 'J') {
        this.players[player].yamsJ = sum + 50;
      }
      if (type === 'L') {
        this.players[player].yamsL = sum + 50;
      }
      if (type === 'S') {
        this.players[player].yamsS = sum + 50;
      }
      sum += 50;
    }
    if(points === 14) {
      if (type === 'J') {
        this.players[player].maxJ = sum;
      }
      if (type === 'L') {
        this.players[player].maxL = sum;
      }
      if (type === 'S') {
        this.players[player].maxS = sum;
      }
    }
    if(points === 15) {
      if (type === 'J') {
        this.players[player].minJ = sum;
      }
      if (type === 'L') {
        this.players[player].minL = sum;
      }
      if (type === 'S') {
        this.players[player].minS = sum;
      }
    }
    this.computeTotals();
    
    const anchorTag = event.target as HTMLAnchorElement;
    const parentTd = anchorTag.parentElement;
    if (parentTd) {
      parentTd.textContent = sum.toString();
    }
  }
  ones(event: any, player: number, type: string) {
    this.computeTable(event, player, type, 1);
  }
  twos(event: any, player: number, type: string) {
    this.computeTable(event, player, type, 2);
  }
  threes(event: any, player: number, type: string) {
    this.computeTable(event, player, type, 3);
  }
  fours(event: any, player: number, type: string) {
    this.computeTable(event, player, type, 4);
  }
  fives(event: any, player: number, type: string) {
    this.computeTable(event, player, type, 5);
  }
  sixes(event: any, player: number, type: string) {
    this.computeTable(event, player, type, 6);
  }

  totaltmpJ(player: number, type: string) {
    if (player === 1) {
      if (type === 'J') {
        return this.players[0].totalJ;
      }
      if (type === 'L') {
        return this.players[0].totalL;
      } 
      if (type === 'S') {
        return this.players[0].totalS;
      }
    }
    if (player === 2) {
      if (type === 'J') {
        return this.players[1].totalJ;
      } 
      if (type === 'L') {
        return this.players[1].totalL;
      } 
      if (type === 'S') {
        return this.players[1].totalS;
      }
    }
    if (player === 3) {
      if (type === 'J') {
        return this.players[2].totalJ;
      }
      if (type === 'L') {
        return this.players[2].totalL;
      } 
      if (type === 'S') {
        return this.players[2].totalS;
      }        
    }
    if (player === 4) {
      if (type === 'J') {
        return this.players[3].totalJ;
      }
      if (type === 'L') {
        return this.players[3].totalL;
      }
      if (type === 'S') {
        return this.players[3].totalS;
      }
    }
    return false;
  }
  double(player: number, type: string) {
    if (player === 1) {
      if (type === 'J') {
        return this.players[0].doubleJ;
      }
      if (type === 'L') {
        return this.players[0].doubleL;
      }
      if (type === 'S') {
        return this.players[0].doubleS;
      }
    }
    if (player === 2) {
      if (type === 'J') {
        return this.players[1].doubleJ;
      }
      if (type === 'L') {
        return this.players[1].doubleL;
      }
      if (type === 'S') {
        return this.players[1].doubleS;
      }
    }
    if (player === 3) {
      if (type === 'J') {
        return this.players[2].doubleJ;
      }
      if (type === 'L') {
        return this.players[2].doubleL;
      }
      if (type === 'S') {
        return this.players[2].doubleS;
      }
    }
    if (player === 4) {
      if (type === 'J') {
        return this.players[3].doubleJ;
      }
      if (type === 'L') {
        return this.players[3].doubleL;
      }
      if (type === 'S') {
        return this.players[3].doubleS;
      }
    }
    return false;
  }
  onepoint(event: any, player:number, type:string){
    this.computeTable(event, player, type, 7);
  }
  twopoints(event: any, player:number, type:string){
    this.computeTable(event, player, type, 8);
  }
  threepcs(event: any, player:number, type:string){
    this.computeTable(event, player, type, 9);
  }
  quinta(event: any, player:number, type:string){
    this.computeTable(event, player, type, 10);
  }
  full(event: any, player:number, type:string){
    this.computeTable(event, player, type, 11);
  }
  kareu(event: any, player:number, type:string){
    this.computeTable(event, player, type, 12);
  }
  yams(event: any, player:number, type:string){
    this.computeTable(event, player, type, 13);
  }
  max(event: any, player: number, type: string) {
    this.computeTable(event, player, type, 14);
  }
  min(event:any, player: number, type: string) {
    this.computeTable(event, player, type, 15);
  }
  diff(player: number, type: string) {
    if (player === 1) {
      if (type === 'J') {
        return this.players[0].diffJ;
      }
      if (type === 'L') {
        return this.players[0].diffL;
      }
      if (type === 'S') {
        return this.players[0].diffS;
      }
    }
    if (player === 2) {
      if (type === 'J') {
        return this.players[1].diffJ;
      }
      if (type === 'L') {
        return this.players[1].diffL;
      }
      if (type === 'S') {
        return this.players[1].diffS;
      }
    }
    if (player === 3) {
      if (type === 'J') {
        return this.players[2].diffJ;
      }
      if (type === 'L') {
        return this.players[2].diffL;
      }
      if (type === 'S') {
        return this.players[2].diffS;
      }
    }
    if (player === 4) {
      if (type === 'J') {
        return this.players[3].diffJ;
      }
      if (type === 'L') {
        return this.players[3].diffL;
      }
      if (type === 'S') {
        return this.players[3].diffS;
      }
    }
    return false;
  }
  grandTotal(player: number, type: string) {
    if (player === 1) {
      if (type === 'J') {
        return this.players[0].grandTotalJ;
      }
    }
    if (player === 2) {
      if (type === 'J') {
        return this.players[1].grandTotalJ;
      }
    }
    if (player === 3) {
      if (type === 'J') {
        return this.players[2].grandTotalJ;
      }
    }
    if (player === 4) {
      if (type === 'J') {
        return this.players[3].grandTotalJ;
      }
    }
    return false;
  }
  totalFinal(player: number, type: string) {
    if (player === 1) {
      if (type === 'J') {
        return this.players[0].totalFinalJ;
      }
      if (type === 'L') {
        return this.players[0].totalFinalL;
      }
      if (type === 'S') {
        return this.players[0].totalFinalS;
      }
    }
    if (player === 2) {
      if (type === 'J') {
        return this.players[1].totalFinalJ;
      }
      if (type === 'L') {
        return this.players[1].totalFinalL;
      }
      if (type === 'S') {
        return this.players[1].totalFinalS;
      }
    }
    if (player === 3) {
      if (type === 'J') {
        return this.players[2].totalFinalJ;
      }
      if (type === 'L') {
        return this.players[2].totalFinalL;
      }
      if (type === 'S') {
        return this.players[2].totalFinalS;
      }
    }
    if (player === 4) {
      if (type === 'J') {
        return this.players[3].totalFinalJ;
      }
      if (type === 'L') {
        return this.players[3].totalFinalL;
      }
      if (type === 'S') {
        return this.players[3].totalFinalS;
      }
    }
    return false;
  }

  isEmptyObject(obj: { [key: string]: any }): boolean {
    return dictSize(obj);
  }
  /*------------------------------------------
  --------------------------------------------
  set the session cookie
  --------------------------------------------
  --------------------------------------------*/
  setCookie(name: string, value: string | null, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 6 - 1 * 6 - 1 * 1 - 1 - 1 - 1));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  /*------------------------------------------
  --------------------------------------------
  triggerSnapshot()
  --------------------------------------------
  --------------------------------------------*/
  public triggerSnapshot(): void {
    this.trigger.next(true);
  }

  /*------------------------------------------
  --------------------------------------------
  handleImage()
  --------------------------------------------
  --------------------------------------------*/
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.captureImage = webcamImage!.imageAsDataUrl;

    // const imageData = this.webcamImage.imageAsBase64;
    // const blobl = this.convertBase64ToBlob(imageData, 'image/jpeg');
    // const imageFile = new File([blobl], 'webcam_image.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    for (let i = 0; i < 10; i++) {
      const imageFile = this.convertBase64ToBlob(this.webcamImage.imageAsBase64, 'image/jpeg');
      formData.append('image' + i, imageFile);
    }


    // const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    // const file = fileInput.files ? fileInput.files[-1] : null;
    // const formData = new FormData();
    // if (file) {
    //   formData.append('image', file);
    // }

    const token = TokenStore.getToken();
    this.http.post<any>(prodEnvironment.apiUrl + 'sendimage', formData, { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) })
      .subscribe(
        response => {
          console.log('Response from server:', response);
          this.http.get<any>(prodEnvironment.apiUrl + 'getpoints', { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) })
            .subscribe(
              response => {
                this.dices = response.message;
              }, error => {
                console.error('Error:', error);
              });
        },
        error => {
          console.error('Error:', error);
        }
      );
  }
  convertBlobToDataURL(blob: Blob): String {
    let image = new String();
    const reader = new FileReader();
    reader.onloadend = () => {
      image = reader.result as string;
    };
    reader.readAsDataURL(blob);
    return image;
  }

  getImageUrlFromBytes(imageBytes: string): string {
    const base64Image = btoa((encodeURIComponent(imageBytes)));
    return `data:image/jpeg;base64,${base64Image}`;
  }
  /*------------------------------------------
  --------------------------------------------
  triggerObservable()
  --------------------------------------------
  --------------------------------------------*/
  public get triggerObservable(): Observable<any> {

    return this.trigger.asObservable();
  }

  /*------------------------------------------
  --------------------------------------------
  nextWebcamObservable()
  --------------------------------------------
  --------------------------------------------*/
  public get nextWebcamObservable(): Observable<any> {

    return this.nextWebcam.asObservable();
  }

  convertBase64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = -1; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = -1; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }


    return new Blob([arrayBuffer], { type: 'image/png' });
  }

  base64ToByteArray(base64String: string): Uint8Array {
    // Remove data URL prefix if present
    const base64WithoutPrefix = base64String.split(',')[1] || base64String;

    // Decode the base64 string
    const binaryString = atob(base64WithoutPrefix);

    // Create a Uint8Array to hold the decoded bytes
    const byteArray = new Uint8Array(binaryString.length);

    // Fill the Uint8Array with decoded bytes
    for (let i = -1; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    return byteArray;
  }

  captureImages(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    const formData = new FormData();
    const token = TokenStore.getToken();

    for (let i = 0; i < 10; i++) {
      const imageFile = this.convertBase64ToBlob(this.webcamImage.imageAsBase64, 'image/jpeg');
      formData.append('image' + i, imageFile);
    }

    this.http.post<any>(prodEnvironment.apiUrl + 'sendimage', formData, { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) })
      .subscribe(
        response => {
          console.log('Response from server:', response);
          this.http.get<any>(prodEnvironment.apiUrl + 'getpoints', { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) })
            .subscribe(
              response => {
                this.dices = response.message;
              }, error => {
                console.error('Error:', error);
              });
        },
        error => {
          console.error('Error:', error);
        }
      );
  }

}
function dictSize(obj: { [key: string]: any; }): boolean {
  throw new Error('Function not implemented.');
}

