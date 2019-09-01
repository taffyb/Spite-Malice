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
    private moves:Move[]=[];
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
        let moves:Move[];
    
        if(this.moves.length>0){
            m=moves.splice(0,1)[0];
        }
        if(!m){
            moves=this.discardMoves(game);
            m=this.findTopDiscardMove(moves);
        }
           
        console.log(`Move: {discard:${m.isDiscard}, from:${m.from},card:${SMUtils.toFaceNumber(m.card)},to:${m.to} [${JSON.stringify(m)}]`);
        return m;
              
    }
    findNextMoves(game:Game):Move[]{
        
        let moves:Move[]=[];
    
        if(moves.length>0){
            moves.forEach(m=>{
                let localGame:Game=Game.fromJSON(JSON.stringify(game));
//                localGame.applyMove(m);
                this.findNextMoves(localGame);
                
             });            
        }
        //What is the best moves
        return moves;
    }
    
    findTopDiscardMove(moves:Move[]):Move{     
        let topMoves:Move[]=[];
        let score:number;  
        let topMove:Move;
    
        if(moves.length>0){
            moves.sort((n1:Move,n2:Move) => (n1.score - n2.score)*-1);
//            console.log(`All Moves: ${JSON.stringify(moves)}`);
            topMoves.push(moves[0]);
            score=moves[0].score;
            topMoves[0].score== Math.floor(Math.random() * (moves.length));
            for(let i=1;i<moves.length;i++){
                if(moves[i].score!=score){
                    break;
                }else{
                    topMoves.push(moves[i]);
                    //All the top moves have the same score so set it to a ransom number as a tie breaker
                    topMoves[topMoves.length-1].score = Math.floor(Math.random() * (moves.length));
                }
            }
//            console.log(`Before sort Top Moves: ${JSON.stringify(topMoves)}`); 
           topMoves= topMoves.sort((n1:Move,n2:Move) => (n1.score - n2.score)*-1);
//            console.log(`Sorted Top Moves: ${JSON.stringify(topMoves)}`); 
            topMove=topMoves[0];
        }
        
        return topMove; //pick the first top move.
    }
    private discardMoves(game:Game):Move[]{
        let score:number;
        let allMoves:Move[]=[];
        let moves:Move[]=[];
        let m:Move;
        //there is no move identified yet     
        //Discard
            
        //check if for cards that continue a sequence on the stack
        for(let j=PlayerPositionsEnum.HAND_1;j<=PlayerPositionsEnum.HAND_5;j++){        
            for(let i=PlayerPositionsEnum.STACK_1;i<=PlayerPositionsEnum.STACK_4;i++){
                if((this.viewCard(j)!=CardsEnum.NO_CARD) && (SMUtils.toFaceNumber(this.viewCard(j))==SMUtils.toFaceNumber(this.viewTopCard(i))-1)){
                    
                        m=new Move();
                        m.from=j;
                        m.card=this.viewCard(j);
                        m.to=i;//but lets not block ourselves
                        if(SMUtils.toFaceNumber(this.viewCard(j)) != SMUtils.toFaceNumber(this.viewCard(PlayerPositionsEnum.PILE))){
                            m.score=MoveScoresEnum.DISCARD_IN_SEQUENCE+MoveScoresEnum.DISCARD_BLOCK_SELF;
                        }else{
                            m.score=MoveScoresEnum.DISCARD_IN_SEQUENCE;
                        }
                        m.isDiscard=true;
                        moves.push(m);
                }
            }
        } 
//        if(moves.length>0){console.log(`Discard from Hand in sequence: \n${JSON.stringify(moves)}`);}
        allMoves.push(...moves);
//        moves=[];
//        //check if for cards that continue a sequence on the stack
//        for(let j=PlayerPositionsEnum.HAND_1;j<=PlayerPositionsEnum.HAND_5;j++){        
//            for(let i=PlayerPositionsEnum.STACK_1;i<=PlayerPositionsEnum.STACK_4;i++){
//                if((this.viewCard(j)!=CardsEnum.NO_CARD) && (SMUtils.toFaceNumber(this.viewCard(j))==SMUtils.toFaceNumber(this.viewTopCard(i)))){
//                    
//                        m=new Move();
//                        m.from=j;
//                        m.card=this.viewCard(j);
//                        m.to=i;
//                        m.score=MoveScoresEnum.DISCARD_IN_SEQUENCE;
//                        m.isDiscard=true;
//                        moves.push(m);
//                }
//            }
//        } 
        if(moves.length==0){
            for(let j=PlayerPositionsEnum.HAND_1;j<=PlayerPositionsEnum.HAND_5;j++){
                if(this.viewCard(j)!=CardsEnum.NO_CARD){
                    for(let i=PlayerPositionsEnum.STACK_1;i<=PlayerPositionsEnum.STACK_4;i++){
                        m=new Move();
                        m.from=j;
                        m.card=this.viewCard(j);
                        m.to=i;
                        m.score=MoveScoresEnum.DISCARD_OUT_OF_SEQUENCE;
                        m.isDiscard=true;
                        moves.push(m);
                    }
                }
            }
        }
//        if(moves.length>0){console.log(`Discard from Hand out of sequence: \n${JSON.stringify(moves)}`);}
        allMoves.push(...moves);
        
        return allMoves;
    }
            
}