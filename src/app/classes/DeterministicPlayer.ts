import {MoveScoresEnum} from './DeterministicEnum';
import {PlayerPositionsEnum} from './Enums';
import {PlayerTypesEnum} from './Enums';
import {GamePositionsEnum} from './Enums';
import {CardsEnum} from './Enums';
import {Player} from './Player';
import {Game} from './Game';
import {Move} from './Move';
import {SMUtils} from './SMUtils';
import {AutoPlayer} from './AutoPlayer';


export class DeterministicPlayer extends AutoPlayer{
    
    constructor(){
        super();
        this.type=PlayerTypesEnum.DETERMINISTIC;
    }
    
    static fromPlayer(player:Player):DeterministicPlayer{
        let dp:DeterministicPlayer = new this();
        dp.guid=player.guid;
        dp.name=player.name;
        if(player.cards){
            dp.cards= JSON.parse(JSON.stringify(player.cards));
        }else{
            dp.initialiseCards();
        }          
        
        dp.isPrimary=false;
        return dp;
    }

    findNextMove(game:Game):Move{
        let m:Move;
        
        //Check if can move off PILE
        const topOfPile:number=this.viewCard(PlayerPositionsEnum.PILE);
        let topOfStack:number;
    
        //if top of pile is a Joker then move to stack
        if(topOfPile==CardsEnum.JOKER){
            m=new Move();
            m.from=PlayerPositionsEnum.PILE
            m.card=topOfStack;
            // just pick the first stack
            m.to=GamePositionsEnum.BASE+GamePositionsEnum.STACK_1;
        }else{
            for(let i:number=0;i<game.centreStacks.length;i++){
                topOfStack=game.viewTopOfStack(i);
                if(SMUtils.toFaceNumber(topOfPile)==SMUtils.toFaceNumber(topOfStack)+1){
                    m=new Move();
                    m.from=PlayerPositionsEnum.PILE;
                    m.card=topOfStack;
                    m.to=GamePositionsEnum.BASE+i;
                    break;
                }
            }            
        }
            
        //there is no move identified yet
        if(!m){
            // can I move to a centre stack
            for(let j=PlayerPositionsEnum.HAND_1;j<=PlayerPositionsEnum.STACK_4;j++){        
                for(let i=GamePositionsEnum.STACK_1;i<GamePositionsEnum.STACK_4;i++){
                    if(SMUtils.toFaceNumber(this.viewCard(j))==CardsEnum.JOKER || 
                       SMUtils.toFaceNumber(this.viewCard(j))==SMUtils.toFaceNumber(game.viewTopOfStack(i))+1){
                        m=new Move();
                        m.from=j;
                        m.card=this.viewCard(j);
                        m.to=GamePositionsEnum.BASE+i;
                        break;
                    }
                }
                if(m){ //If a move has been found
                    break;
                }
            }
        }
            
        //there is no move identified yet
        if(!m){
            // find the first card in the hand that is 1 less than a card in the stack
            for(let j=PlayerPositionsEnum.HAND_1;j<=PlayerPositionsEnum.HAND_5;j++){        
                for(let i=GamePositionsEnum.STACK_1;i<GamePositionsEnum.STACK_4;i++){
                    if(SMUtils.toFaceNumber(this.viewCard(j))==SMUtils.toFaceNumber(game.viewTopOfStack(i))-1){
                        m=new Move();
                        m.from=j;
                        m.card=this.viewCard(j);
                        m.to=GamePositionsEnum.BASE+i;
                        break;
                    }
                }
                if(m){ //If a move has been found
                    break;
                }
            }
            if(!m){            
                // Discard
                // just take the first card in the hand and move it to the first stack
                m=new Move();
                for(let h:number=PlayerPositionsEnum.HAND_1;h<=PlayerPositionsEnum.HAND_5;h++){
                    if(this.cards[h]!=CardsEnum.NO_CARD){
                        m.from=h;
                        m.card=this.cards[h];
                        m.to=PlayerPositionsEnum.STACK_1;
                        m.isDiscard=true;
                        break;
                    }
                }
            }
        }            
            
        return m;
    }
    private isValidMove(m:Move,game:Game):number{
        let score:MoveScoresEnum;
        
        return score;
    }
}