import {CardsEnum} from './Enums';

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
}