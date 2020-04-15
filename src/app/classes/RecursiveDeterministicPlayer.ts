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


export class RecursiveDeterministicPlayer extends AutoPlayer{
    private moves:AutoMove[]=[];
    constructor(){
        super();
        this.type=PlayerTypesEnum.REC_DETERMINISTIC;
    }
    
    static fromPlayer(player:Player):RecursiveDeterministicPlayer{
        let dp:RecursiveDeterministicPlayer = new this();
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
        console.log(`${this.name}: findNextMove`);
        let m:Move;        
        let possibleMoves:AutoMove[]=[];
        let moves:AutoMove[];
        
        
        if(this.moves.length>0){
            m = this.moves.splice(0,1)[0]; 
        }else{
            this.findNextMoves(game, possibleMoves);
            moves=possibleMoves;
            moves.forEach(m=>{
                m.score=this.calculateOverallScore(m);
            });
            console.log(`all found moves:\n${SMUtils.movesToString(moves)}`);
  
            let bestFinalMove:AutoMove=this.findTopMove(moves);
            if(bestFinalMove){
                delete bestFinalMove.nextMoves;
                this.moves.push(bestFinalMove);
                while(bestFinalMove.previousMove){
                    let previousMove:AutoMove=bestFinalMove.previousMove;
                    
                    this.moves.splice(0,0,previousMove);
                    bestFinalMove=previousMove;
                    delete bestFinalMove.nextMoves;
                }
                console.log(`Best Moves.length ${this.moves.length}`);
                console.log(`Best Move:\n ${SMUtils.movesToString(this.moves)}`);
                m = this.moves.splice(0,1)[0];                
            }
        }
        if(!m){
            possibleMoves=this.discardMoves(game);
            m=this.findTopDiscardMove(possibleMoves);
        }
           
//        console.log(`Move: ${SMUtils.moveToString(m)}`);
        m.puuid=this.uuid;
        return m;              
    }
    findTopMove(moves:AutoMove[]):AutoMove{    
        let topMoves:AutoMove[]=[];
        let score:number;  
        let topMove:AutoMove;
    
        if(moves.length>0){
            moves.sort((n1:AutoMove,n2:AutoMove) => (n1.score - n2.score)*-1);
//            console.log(`Sorted Moves: ${SMUtils.movesToString(moves)}`);
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
//            console.log(`Before sort Top Moves: ${SMUtils.movesToString(topMoves)}`); 
           topMoves= topMoves.sort((n1:AutoMove,n2:AutoMove) => (n1.score - n2.score)*-1);
            topMove=topMoves[0];//pick the first top move.
        }

//    if(topMove){console.log(`Top Move:\n ${SMUtils.moveToString(topMove)}`);} 
    return topMove; 
    }
    findNextMoves(game:Game,possibleMoves:AutoMove[],depth:number=0):AutoMove[]{
        depth+=1;
        let m:AutoMove;
        let moves:AutoMove[]=[];
        let allMoves:AutoMove[]=[];
        let activePlayer:Player = game.players[game.activePlayer];
        let bail=false;
    
        for(let pp:number=PlayerPositionsEnum.PILE;pp<=PlayerPositionsEnum.STACK_4;pp++){
            if(bail){break;}
            switch(pp){
            case PlayerPositionsEnum.PILE:
                for(let gp:number=GamePositionsEnum.STACK_1;gp<=GamePositionsEnum.STACK_4;gp++){
                    
                    if(SMUtils.isJoker(game, activePlayer, pp)){
                        // TODO will want to build this out

                        m=new AutoMove();
                        m.from=pp;
                        m.card=SMUtils.cardValue(game, activePlayer, pp);
                        m.to=gp+GamePositionsEnum.BASE;
                        m.score=MoveScoresEnum.FROM_PILE;
                        m.isDiscard=false;
                        
                        moves.push(m);
                    }else{
                        if(SMUtils.difference(game, activePlayer, pp, GamePositionsEnum.BASE+gp)==1){
                            
                            let card1=SMUtils.toFaceNumber(SMUtils.cardValue(game, activePlayer, pp));
                            let card2=SMUtils.toFaceNumber(SMUtils.cardValue(game, activePlayer, gp));
    //                        console.log(`depth==${depth} pos1=${pp}/${card1}, pos2=${gp}/${card2} => ${card1 - card2}`);
                            
                            m=new AutoMove();
                            m.from=pp;
                            m.card=SMUtils.cardValue(game, activePlayer, pp);
                            m.to=gp+GamePositionsEnum.BASE;
                            m.score=MoveScoresEnum.FROM_PILE;
                            m.isDiscard=false;
    
                            moves.push(m);
                            bail=true;
                            break; // no point looking at other options
                        }
                    }
                }
//                if(moves.length>0){console.log(`Move from PILE: \n${JSON.stringify(moves)}`);}
                
                allMoves.push(...moves);
                moves=[];
                break;
            case PlayerPositionsEnum.HAND_1:
            case PlayerPositionsEnum.HAND_2:
            case PlayerPositionsEnum.HAND_3:
            case PlayerPositionsEnum.HAND_4:
            case PlayerPositionsEnum.HAND_5:
                if(SMUtils.toFaceNumber(SMUtils.cardValue(game,activePlayer,pp))!=CardsEnum.NO_CARD){  
    //            Possible moves from Hand to Centre Stack              
                  for(let gp=GamePositionsEnum.STACK_1;gp<=GamePositionsEnum.STACK_4;gp++){
                      if(SMUtils.isJoker(game, activePlayer, pp) || 
                      SMUtils.difference(game, activePlayer, pp, GamePositionsEnum.BASE+gp)==1){
                        m=new AutoMove();
                        m.from=pp;
                        m.card=SMUtils.cardValue(game,activePlayer,pp);
                        m.to=GamePositionsEnum.BASE+gp;
                        m.score=(MoveScoresEnum.PLAY_FROM_HAND+MoveScoresEnum.ADD_TO_STACK); 
                        moves.push(m);
                      }
                  }
                  
    //            Posible moves from Hand to Player Stack (an open space)              
                  for(let ps=PlayerPositionsEnum.STACK_1;ps<=PlayerPositionsEnum.STACK_4;ps++){
                      if(SMUtils.toFaceNumber(SMUtils.cardValue(game,activePlayer,ps))==CardsEnum.NO_CARD){
                        m=new AutoMove();
                        m.from=pp;
                        m.card=SMUtils.cardValue(game,activePlayer,pp);
                        m.to=ps;
                        m.score=(MoveScoresEnum.OPEN_A_SPACE+SMUtils.toFaceNumber(SMUtils.cardValue(game,activePlayer,pp)));
                        moves.push(m);
                      }
                  }
                }
              allMoves.push(...moves);
              moves=[];
              break;
            case PlayerPositionsEnum.STACK_1:
            case PlayerPositionsEnum.STACK_2:
            case PlayerPositionsEnum.STACK_3:
            case PlayerPositionsEnum.STACK_4:
                
//              Posible moves from Player Stack to Centre Stack                
                for(let gp=GamePositionsEnum.STACK_1;gp<=GamePositionsEnum.STACK_4;gp++){
                    
                    if(SMUtils.isJoker(game, activePlayer, pp) || 
                    SMUtils.difference(game, activePlayer, pp, GamePositionsEnum.BASE+gp)==1){
//                        if(pp==8){console.log(`isJoker:${SMUtils.isJoker(game, activePlayer, pp)} ||
//                        difference:(${SMUtils.toFaceNumber(SMUtils.cardValue(game,activePlayer,pp))}-${SMUtils.toFaceNumber(SMUtils.cardValue(game,activePlayer,GamePositionsEnum.BASE+gp))})==${SMUtils.difference(game, activePlayer, pp, GamePositionsEnum.BASE+gp)}`);}
                      m=new AutoMove();
                      m.from=pp;
                      m.card=SMUtils.cardValue(game,activePlayer,pp);
                      m.to=GamePositionsEnum.BASE+gp;
                      m.score=(MoveScoresEnum.PLAY_FROM_STACK+MoveScoresEnum.ADD_TO_STACK);
                      moves.push(m);
                    }
                }
                allMoves.push(...moves);
//                console.log(`Game[${game.id}] ${SMUtils.movesToString(moves)}`);
                moves=[];
                break;               
            }
        }
    
//        Now for each move identified apply that move and see where we could move next
        if(allMoves.length>0 ){
            for(let i=0;i<allMoves.length;i++){
                let m:AutoMove=allMoves[i];
                let localGame:Game=Game.fromJSON(JSON.stringify(game));
            
                if(m.from == PlayerPositionsEnum.PILE){
                  //If this is a move from the PILE we can't look further as we don't know what the next card is.
                    possibleMoves.push(m);
                }else{
                    localGame.applyMove(m);
                    if(activePlayer.cardsInHand()==0){
                        //Increase score of move because will get 5 new cards
                        
                        //Stop looking for further moves until have refilled hand
                    }else{
                        //if(depth<=1){
                            m.nextMoves=this.findNextMoves(localGame,possibleMoves,depth);
                            for(let i=0;i<m.nextMoves.length;i++){
                               m.nextMoves[i].previousMove=m; 
                            }
                        //}else{
                        //    m.nextMoves=[];
                        //}
//                        console.log(`previousMove:(${m.previousMove}) nextMoves[${m.nextMoves.length}]\n${SMUtils.moveToString( m)}`);
                                                
                        if(m.nextMoves.length==0){
                            //add to possible moves
                            possibleMoves.push(m);
                        }                  
                    }                    
                }
             }    
//             console.log(`allMoves(${depth}:\n${SMUtils.movesToString(allMoves)}`);         
        }
        return allMoves;
    }
    calculateOverallScore(finalMove:AutoMove):number{
        let move:AutoMove=finalMove;
        let score:number=move.score;
        
        while(move.previousMove){
            score+=finalMove.previousMove.score;
            move=move.previousMove;
        }
        return score;        
    }
    
    findTopDiscardMove(moves:AutoMove[]):AutoMove{     
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
                    //All the top moves have the same score so set it to a random number as a tie breaker
                    topMoves[topMoves.length-1].score = Math.floor(Math.random() * (moves.length));
                }
            }
//            console.log(`Before sort Top Moves: ${JSON.stringify(topMoves)}`); 
            topMoves= topMoves.sort((n1:AutoMove,n2:AutoMove) => (n1.score - n2.score)*-1);
            topMove=topMoves[0];
        }
        
        return topMove; //pick the first top move.
    }
    private discardMoves(game:Game):AutoMove[]{
        let score:number;
        let allMoves:AutoMove[]=[];
        let moves:AutoMove[]=[];
        let m:AutoMove;
        let activePlayer:Player = game.players[game.activePlayer];
        //there is no move identified yet     
        //Discard
            
        //check for cards that continue a sequence on the stack
        for(let ph=PlayerPositionsEnum.HAND_1;ph<=PlayerPositionsEnum.HAND_5;ph++){        
            for(let ps=PlayerPositionsEnum.STACK_1;ps<=PlayerPositionsEnum.STACK_4;ps++){
                if(this.viewCard(ps)!=CardsEnum.NO_CARD){
                    let score:number;                    
                    score = SMUtils.difference(game, activePlayer, ph, ps);
//                    console.log(`ph(${ph},${SMUtils.toFaceNumber(SMUtils.cardValue(game,activePlayer,ph))}) `+
//                                `ps(${ps},${SMUtils.toFaceNumber(SMUtils.cardValue(game,activePlayer,ps))}) `+
//                                `difference(${SMUtils.difference(game, activePlayer, ph, ps)})`);
                    if(score <=0){
                        //but lets not block ourselves
                        if(SMUtils.difference(game, activePlayer, ph, PlayerPositionsEnum.PILE)<=0){
                            score+=MoveScoresEnum.DISCARD_BLOCK_SELF;
                        }    
    
                        m=new AutoMove();
                        m.from=ph;
                        m.card=SMUtils.cardValue(game,activePlayer,ph);
                        m.to=ps;
                        m.score=MoveScoresEnum.DISCARD_IN_SEQUENCE+score;
                        m.isDiscard=true;
                        moves.push(m);  
                    }
                }
            }
        } 
//        if(moves.length>0){console.log(`Discard from Hand in sequence: \n${JSON.stringify(moves)}`);}
        allMoves.push(...moves);

        if(moves.length==0){
            for(let ph=PlayerPositionsEnum.HAND_1;ph<=PlayerPositionsEnum.HAND_5;ph++){
                if(this.viewCard(ph)!=CardsEnum.NO_CARD){
                    for(let ps=PlayerPositionsEnum.STACK_1;ps<=PlayerPositionsEnum.STACK_4;ps++){
                        let score:number;                    
                        score = SMUtils.difference(game, activePlayer, ph, ps);
                        if(score>=0){
                            m=new AutoMove();
                            m.from=ph;
                            m.card=this.viewCard(ph);
                            m.to=ps;
                            m.score=MoveScoresEnum.DISCARD_OUT_OF_SEQUENCE+score;
                            m.isDiscard=true;
                            moves.push(m);                            
                        }
                    }
                }
            }
        }
//        if(moves.length>0){console.log(`Discard from Hand out of sequence: \n${JSON.stringify(moves)}`);}
        allMoves.push(...moves);
        
        return allMoves;
    }
            
}