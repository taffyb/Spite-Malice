import {MoveScoresEnum} from './DeterministicEnum';
import {PlayerPositionsEnum} from './Enums';
import {PlayerTypesEnum} from './Enums';
import {GamePositionsEnum} from './Enums';
import {CardsEnum} from './Enums';
import {Player} from './Player';
import {Game} from './Game';
import {Move} from './Move';
import {AutoMove} from './AutoMove';
import {SMUtils} from './SMUtils';
import {AutoPlayer} from './AutoPlayer';


export class DeterministicPlayer extends AutoPlayer{
    
    constructor(){
        super();
        this.type=PlayerTypesEnum.DETERMINISTIC;
    }
    
    static fromPlayer(player:Player):DeterministicPlayer{
        let dp:DeterministicPlayer = new this();
        dp.uuid=player.uuid;
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
        let moves:AutoMove[];
    
        moves=this.validMoves(game);
        if(moves.length>0){
            m=this.findTopMove(moves);
        }
        if(!m){
            moves=this.discardMoves(game);
            m=this.findTopMove(moves);
        }
           
        console.log(`Move: {discard:${m.isDiscard}, from:${m.from},card:${SMUtils.toFaceNumber(m.card)},to:${m.to} [${JSON.stringify(m)}]`);
        return m;
              
    }
    findTopMove(moves:AutoMove[]):AutoMove{     
        let topMoves:AutoMove[]=[];
        let score:number;  
        let topMove:AutoMove;
    
        if(moves.length>0){
            moves.sort((n1:AutoMove,n2:AutoMove) => (n1.score - n2.score)*-1);
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
           topMoves= topMoves.sort((n1:AutoMove,n2:AutoMove) => (n1.score - n2.score)*-1);
//            console.log(`Sorted Top Moves: ${JSON.stringify(topMoves)}`); 
            topMove=topMoves[0];
        }
        
        return topMove; //pick the first top move.
    }
    private discardMoves(game:Game):AutoMove[]{
        let score:number;
        let allMoves:AutoMove[]=[];
        let moves:AutoMove[]=[];
        let m:AutoMove;
        //there is no move identified yet     
        //Discard
            
        //check if for cards that continue a sequence on the stack
        for(let j=PlayerPositionsEnum.HAND_1;j<=PlayerPositionsEnum.HAND_5;j++){        
            for(let i=PlayerPositionsEnum.STACK_1;i<=PlayerPositionsEnum.STACK_4;i++){
                if((this.viewCard(j)!=CardsEnum.NO_CARD) && (SMUtils.toFaceNumber(this.viewCard(j))==SMUtils.toFaceNumber(this.viewTopCard(i))-1)){
                    
                        m=new AutoMove();
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
                        m=new AutoMove();
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
    private validMoves(game:Game):AutoMove[]{
        let score:number;
        let allMoves:AutoMove[]=[]
        let moves:AutoMove[]=[];
        let m:AutoMove;
        
        for(let pos=0;pos<=PlayerPositionsEnum.STACK_4;pos++){
            if(SMUtils.toFaceNumber(this.viewCard(pos))==CardsEnum.NO_CARD){
                continue;
            }
            switch(pos){
            
                case PlayerPositionsEnum.PILE: 
                    moves=[];
                    
//                    Posible moves from Pile
                    
                    for(let s=0;s<=GamePositionsEnum.STACK_4;s++){
                        if(SMUtils.toFaceNumber(this.viewCard(pos))==CardsEnum.JOKER || 
                        SMUtils.toFaceNumber(this.viewCard(pos))==SMUtils.toFaceNumber(game.viewTopOfStack(s))+1){
                          m=new AutoMove();
                          m.from=pos;
                          m.card=this.viewCard(pos);
                          m.to=GamePositionsEnum.BASE+s;
                          m.score=MoveScoresEnum.FROM_PILE;
                          moves.push(m);
                        }
                    }
//                    if(moves.length>0){console.log(`Posible moves from Pile: \n${JSON.stringify(moves)}`);}
                    allMoves.push(...moves);
                    break;
                case PlayerPositionsEnum.HAND_1:
                case PlayerPositionsEnum.HAND_2:
                case PlayerPositionsEnum.HAND_3:
                case PlayerPositionsEnum.HAND_4:
                case PlayerPositionsEnum.HAND_5:
                    moves=[];
                    
//                    Posible moves from Hand to Centre Stack
                    
                    for(let s=0;s<=GamePositionsEnum.STACK_4;s++){
                        if(SMUtils.toFaceNumber(this.viewCard(pos))==CardsEnum.JOKER || 
                        SMUtils.toFaceNumber(this.viewCard(pos))==SMUtils.toFaceNumber(game.viewTopOfStack(s))+1){
                          m=new AutoMove();
                          m.from=pos;
                          m.card=this.viewCard(pos);
                          m.to=GamePositionsEnum.BASE+s;
                          m.score=(MoveScoresEnum.PLAY_FROM_HAND+MoveScoresEnum.ADD_TO_STACK);
                          moves.push(m);
                        }
                    }
//                    if(moves.length>0){console.log(`Posible moves from Hand to Centre Stack: \n: ${JSON.stringify(moves)}`);}
                    allMoves.push(...moves);
                    moves=[];
                    
//                    Posible moves from Hand to Player Stack (an open space)
                    
                    for(let s=PlayerPositionsEnum.STACK_1;s<=PlayerPositionsEnum.STACK_4;s++){
                        if(SMUtils.toFaceNumber(this.viewCard(s))==CardsEnum.NO_CARD){
                          m=new AutoMove();
                          m.from=pos;
                          m.card=this.viewCard(pos);
                          m.to=s;
                          m.score=(MoveScoresEnum.PLAY_FROM_HAND+MoveScoresEnum.OPEN_A_SPACE+this.viewCard(pos));
                          moves.push(m);
                        }
                    }
//                    if(moves.length>0){console.log(`Posible moves from Hand to Player Stack (an open space): \n: ${JSON.stringify(moves)}`);}
                    allMoves.push(...moves);
                    break;
                case PlayerPositionsEnum.STACK_1:
                case PlayerPositionsEnum.STACK_2:
                case PlayerPositionsEnum.STACK_3:
                case PlayerPositionsEnum.STACK_4:
                    moves=[];
                    
//                    Posible moves from Player Stack to Centre Stack
                    
                    for(let s=0;s<=GamePositionsEnum.STACK_4;s++){
                        if(SMUtils.toFaceNumber(this.viewTopCard(pos))==CardsEnum.JOKER || 
                        SMUtils.toFaceNumber(this.viewTopCard(pos))==SMUtils.toFaceNumber(game.viewTopOfStack(s))+1){
                          m=new AutoMove();
                          m.from=pos;
                          m.card=this.viewTopCard(pos);
                          m.to=GamePositionsEnum.BASE+s;
                          m.score=(MoveScoresEnum.PLAY_FROM_STACK+MoveScoresEnum.ADD_TO_STACK) + this.lookAhead(game, m);
                          moves.push(m);
                        }
                    }
//                    if(moves.length>0){console.log(`Posible moves from Player Statck to Centre Stack: \n: ${JSON.stringify(moves)}`);}
                    allMoves.push(...moves);
                    break;            
            }
        }           
            
        return allMoves;
    }
    lookAhead(game:Game,move:AutoMove):number{
        let modifier:number=0;
        game= Game.fromJSON(JSON.stringify(game));
        if(!move.isDiscard){
            if(move.to>=GamePositionsEnum.BASE+GamePositionsEnum.STACK_1 && move.to<=GamePositionsEnum.BASE+GamePositionsEnum.STACK_1){
                console.log(`game.activePlayer ${game.activePlayer} game.players[${game.players.length}]`);
                game.players[game.activePlayer].removeCard(move.from);
                game.centreStacks[move.to-GamePositionsEnum.BASE].push(move.card);
                let me:Player=game.players[game.activePlayer];

//              Can I now get a card off my pile
                if(me.viewCard(PlayerPositionsEnum.PILE)==move.card+1){
                    modifier+=MoveScoresEnum.FROM_PILE+1;
                }

//              Can my oposition now get a card off their pile
                let opId:number =(game.activePlayer+1) % (game.players.length);
                let op:Player=game.players[opId];
                if(op.viewCard(PlayerPositionsEnum.PILE)==move.card+1){
                    modifier-=MoveScoresEnum.FROM_PILE;
                }
                
//                Can I now move another card
                let moves:AutoMove[] = this.validMoves(game);
                if(moves.length>0){
                    
                    modifier+= this.findTopMove(moves).score;
                }
                
            }
        }
        
        return modifier;
    }
            
}