import {CardsEnum} from './Enums';
import {PlayerPositionsEnum} from './Enums';
import {GamePositionsEnum} from './Enums';
import {Game} from './Game';
import {Move} from './Move';
import {Player} from './Player';

export class SMUtils{
    constructor(){}
    
    static toFaceNumber(card:number):number{
        let c:number;
        if(card>CardsEnum.DECK){
            c=CardsEnum.JOKER;
        }else if(card>CardsEnum.NO_CARD){
            c=card%CardsEnum.KING;
            if(c==0){
                c=CardsEnum.KING;
            }
        }else{
            c=CardsEnum.NO_CARD;
        }
        return c;
    }
    
    static difference(game:Game,player:Player,position1:number,position2:number):number{
        let card1:number;
        let card2:number;
    
        card1=this.toFaceNumber(this.cardValue(game, player, position1));
        card2=this.toFaceNumber(this.cardValue(game, player, position2));
//        console.log(`pos1=${position1}/${card1}, pos2=${position2}/${card2} => ${card1 - card2}`);
        return  card1 - card2;
    }
    
    static cardValue(game:Game,player:Player,position:number):number{
        let card:number=CardsEnum.NO_CARD;
        if(position>=GamePositionsEnum.BASE){
            card=game.viewTopOfStack(position-GamePositionsEnum.BASE);
        }else{
            card=player.viewCard(position);
        }
        return card;
    }
    static isJoker(game:Game,player:Player,position:number):boolean{
        let card:number = this.toFaceNumber(this.cardValue(game, player, position));
        return card == CardsEnum.JOKER;
    }
    static moveToString(m:Move):string{
        let str:string="";
    
        str+=`{`;
        str+=`from:${m.from},to:${m.to},card:${m.card}(${this.toFaceNumber(m.card)}),isDiscard:${m.isDiscard}`;
        if(m.previousMove){
            str+='\npreviousMove:true';
        }
        if(m.nextMoves){
            str+=`\nnextMoves:[`
            m.nextMoves.forEach(m=>{
                str+=this.moveToString(m);
            });
            str+=`]`;            
        }
        str+=`}`
        return str;
    }
}
