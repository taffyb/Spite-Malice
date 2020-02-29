import {Game} from '../classes/Game';
import {Player} from '../classes/Player';
import {RecursiveDeterministicPlayer} from '../classes/RecursiveDeterministicPlayer';
import { v4 as uuid } from 'uuid';
import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';
import {SuitsEnum} from '../classes/Enums';


export class TestGames{
    games:Game[]=[];
   
    constructor(){
//        this.games.push(this.testGame_1());
//        this.games.push(this.testGame_2());
//        this.games.push(this.testGame_3());
//        this.games.push(this.testGame_4());
    }

    /*
     * Set up game ready to recycle centre stack
     *  
     */ 
    testGame_1():Game{
        const pp=PlayerPositionsEnum;
        const gp=GamePositionsEnum;
        const s=SuitsEnum;
        const c=CardsEnum;
        
        let game:Game=new Game();
        game.name="Recursive Deterministic Player";
        let player:Player=new Player();
        player.initialiseCards();
        
        player.name="Player 1";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.HEARTS+c.KING,
                               s.SPADES+c.QUEEN,
                               s.CLUBS+c.JACK,
                               s.CLUBS+c.KING];
        player.cards[pp.HAND_1]=s.HEARTS+c.ACE;
        player.cards[pp.HAND_2]=s.HEARTS+c.THREE;
        player.cards[pp.HAND_3]=s.HEARTS+c.NINE;
        player.cards[pp.HAND_4]=s.HEARTS+c.JACK;
        player.cards[pp.HAND_5]=s.SPADES+c.FIVE;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.FIVE,s.SPADES+c.SIX];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.HEARTS+c.FOUR,s.SPADES+c.THREE,s.SPADES+c.TWO,s.DIAMONDS+c.ACE];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.NINE,c.JOKER];
        player.cards[pp.STACK_4]=[c.NO_CARD,c.JOKER];
        game.players.push(player);
              
        player=new RecursiveDeterministicPlayer();
        player.initialiseCards();
        player.name="Player 2";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.DIAMONDS+c.FOUR,
                               s.HEARTS+c.FIVE];
        player.cards[pp.HAND_1]=c.NO_CARD;
        player.cards[pp.HAND_2]=s.CLUBS+c.THREE;
        player.cards[pp.HAND_3]=s.SPADES+c.TWO;
        player.cards[pp.HAND_4]=s.HEARTS+c.EIGHT;
        player.cards[pp.HAND_5]=s.SPADES+c.QUEEN;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.SEVEN];
        player.cards[pp.STACK_2]=[c.NO_CARD];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.TEN];
        player.cards[pp.STACK_4]=[c.NO_CARD,s.CLUBS+c.FOUR,s.CLUBS+c.THREE,s.CLUBS+c.TWO];
        player.isPrimary=true;
        game.players.push(player);
        
        game.centreStacks[gp.STACK_1]=[c.NO_CARD];
        game.centreStacks[gp.STACK_2]=[s.CLUBS+c.ACE];
        game.centreStacks[gp.STACK_3]=[s.HEARTS+c.ACE];
        game.centreStacks[gp.STACK_4]=[c.NO_CARD];
        
        
        game.activePlayer=1;
//        console.log(`Test 1: GameGUID=${game.guid}`);
//        console.log(`Centre Stacks: ${JSON.stringify(game.centreStacks)}`);
        return game;        
    }

    /*
     * Set up game ready to recycle centre stack
     *  
     */ 
    testGame_2():Game{
        const pp=PlayerPositionsEnum;
        const gp=GamePositionsEnum;
        const s=SuitsEnum;
        const c=CardsEnum;
        
        let game:Game=new Game();
        game.name="Recursive Deterministic Player";
        let player:Player=new Player();
        player.initialiseCards();
        
        player.name="Player 1";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.HEARTS+c.KING,
                               s.SPADES+c.QUEEN,
                               s.CLUBS+c.JACK,
                               s.CLUBS+c.KING];
        player.cards[pp.HAND_1]=s.HEARTS+c.ACE;
        player.cards[pp.HAND_2]=s.HEARTS+c.THREE;
        player.cards[pp.HAND_3]=s.HEARTS+c.NINE;
        player.cards[pp.HAND_4]=s.HEARTS+c.JACK;
        player.cards[pp.HAND_5]=s.SPADES+c.FIVE;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.FIVE,s.SPADES+c.SIX];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.HEARTS+c.FOUR,s.SPADES+c.THREE,s.SPADES+c.TWO,s.DIAMONDS+c.ACE];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.NINE,c.JOKER];
        player.cards[pp.STACK_4]=[c.NO_CARD,c.JOKER];
        game.players.push(player);
              
        player=new RecursiveDeterministicPlayer();
        player.initialiseCards();
        player.name="Player 2";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.DIAMONDS+c.FOUR,
                               s.HEARTS+c.FIVE];
        player.cards[pp.HAND_1]=c.NO_CARD;
        player.cards[pp.HAND_2]=s.CLUBS+c.THREE;
        player.cards[pp.HAND_3]=s.SPADES+c.EIGHT;
        player.cards[pp.HAND_4]=s.HEARTS+c.EIGHT;
        player.cards[pp.HAND_5]=s.SPADES+c.TWO;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.TWO];
        player.cards[pp.STACK_2]=[c.NO_CARD];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.TEN,s.SPADES+c.SIX,s.SPADES+c.FOUR,s.SPADES+c.THREE];
        player.cards[pp.STACK_4]=[c.NO_CARD,s.CLUBS+c.FIVE];
        player.isPrimary=true;
        game.players.push(player);
        
        game.centreStacks[gp.STACK_1]=[c.NO_CARD];
        game.centreStacks[gp.STACK_2]=[s.CLUBS+c.ACE];
        game.centreStacks[gp.STACK_3]=[s.HEARTS+c.FIVE];
        game.centreStacks[gp.STACK_4]=[c.NO_CARD];
        
        
        game.activePlayer=1;
//        console.log(`Test 1: GameGUID=${game.guid}`);
//        console.log(`Centre Stacks: ${JSON.stringify(game.centreStacks)}`);
        return game;   
    }

    /*
     * Set up game ready to recycle centre stack
     *  
     */ 
    testGame_3():Game{
        const pp=PlayerPositionsEnum;
        const gp=GamePositionsEnum;
        const s=SuitsEnum;
        const c=CardsEnum;
        
        let game:Game=new Game();
        game.name="R D Player - discard tuning";
        let player:Player=new Player();
        player.initialiseCards();
        
        player.name="Player 1";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.HEARTS+c.KING,
                               s.SPADES+c.QUEEN,
                               s.CLUBS+c.JACK,
                               s.CLUBS+c.KING];
        player.cards[pp.HAND_1]=s.HEARTS+c.ACE;
        player.cards[pp.HAND_2]=s.HEARTS+c.THREE;
        player.cards[pp.HAND_3]=s.HEARTS+c.NINE;
        player.cards[pp.HAND_4]=s.HEARTS+c.JACK;
        player.cards[pp.HAND_5]=s.SPADES+c.FIVE;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.FIVE,s.SPADES+c.SIX];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.HEARTS+c.FOUR,s.SPADES+c.THREE,s.SPADES+c.TWO,s.DIAMONDS+c.ACE];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.NINE,c.JOKER];
        player.cards[pp.STACK_4]=[c.NO_CARD,c.JOKER];
        game.players.push(player);
              
        player=new RecursiveDeterministicPlayer();
        player.initialiseCards();
        player.name="Player 2";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.DIAMONDS+c.FOUR,
                               s.HEARTS+c.FIVE];
        player.cards[pp.HAND_1]=s.DIAMONDS+c.FOUR;
        player.cards[pp.HAND_2]=s.CLUBS+c.JACK;
        player.cards[pp.HAND_3]=s.SPADES+c.EIGHT;
        player.cards[pp.HAND_4]=s.HEARTS+c.TEN;
        player.cards[pp.HAND_5]=s.SPADES+c.SEVEN;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.JACK];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.CLUBS+c.THREE];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.TEN,s.SPADES+c.SIX,s.SPADES+c.FOUR,s.SPADES+c.THREE];
        player.cards[pp.STACK_4]=[c.NO_CARD,s.CLUBS+c.SIX];
        player.isPrimary=true;
        game.players.push(player);
        
        game.centreStacks[gp.STACK_1]=[c.NO_CARD];
        game.centreStacks[gp.STACK_2]=[c.NO_CARD];
        game.centreStacks[gp.STACK_3]=[c.NO_CARD];
        game.centreStacks[gp.STACK_4]=[c.NO_CARD];
        
        
        game.activePlayer=1;
//        console.log(`Test 1: GameGUID=${game.guid}`);
//        console.log(`Centre Stacks: ${JSON.stringify(game.centreStacks)}`);
        return game;   
    }
    /*
     * Set up game ready to recycle centre stack
     *  
     */ 
    testGame_4():Game{
        const pp=PlayerPositionsEnum;
        const gp=GamePositionsEnum;
        const s=SuitsEnum;
        const c=CardsEnum;
        
        let game:Game=new Game();
        game.name="undo joker";
        let player:Player=new Player();
        player.initialiseCards();
        
        player.name="Player 1";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.CLUBS+c.NINE,
                               s.CLUBS+c.TEN,
                               s.CLUBS+c.SEVEN,
                               s.CLUBS+c.EIGHT,
                               s.HEARTS+c.TWO];
        player.cards[pp.HAND_1]=s.HEARTS+c.ACE;
        player.cards[pp.HAND_2]=s.HEARTS+c.KING;
        player.cards[pp.HAND_3]=s.HEARTS+c.NINE;
        player.cards[pp.HAND_4]=c.JOKER;
        player.cards[pp.HAND_5]=s.SPADES+c.FIVE;
        player.cards[pp.STACK_1]=[c.NO_CARD];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.HEARTS+c.FOUR];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.CLUBS+c.FIVE];
        player.cards[pp.STACK_4]=[c.NO_CARD];
        player.isPrimary=true;
        game.players.push(player);
              
        player=new Player();
        player.initialiseCards();
        player.name="Player 2";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.CLUBS+c.ACE];
        player.cards[pp.HAND_1]=c.NO_CARD;
        player.cards[pp.HAND_2]=c.NO_CARD;
        player.cards[pp.HAND_3]=c.NO_CARD;
        player.cards[pp.HAND_4]=c.NO_CARD;
        player.cards[pp.HAND_5]=s.SPADES+c.FIVE;
        player.cards[pp.STACK_1]=[c.NO_CARD];
        player.cards[pp.STACK_2]=[c.NO_CARD];
        player.cards[pp.STACK_3]=[c.NO_CARD];
        player.cards[pp.STACK_4]=[c.NO_CARD];
        game.players.push(player);
        
        game.centreStacks[gp.STACK_1]=[c.NO_CARD,
                                      s.DIAMONDS+c.ACE,
                                      s.DIAMONDS+c.TWO,
                                      s.DIAMONDS+c.THREE,
                                      s.DIAMONDS+c.FOUR,
                                      s.DIAMONDS+c.FIVE,
                                      s.DIAMONDS+c.SIX,
                                      s.DIAMONDS+c.SEVEN,
                                      s.DIAMONDS+c.EIGHT,
                                      s.DIAMONDS+c.NINE,
                                      s.DIAMONDS+c.TEN,
                                      s.DIAMONDS+c.JACK,
                                      s.DIAMONDS+c.QUEEN];
        game.centreStacks[gp.STACK_2]=[s.HEARTS+c.FOUR];
        game.centreStacks[gp.STACK_3]=[c.NO_CARD];
        game.centreStacks[gp.STACK_4]=[c.NO_CARD];
        
        
        game.activePlayer=0;
//        console.log(`Test 1: GameGUID=${game.guid}`);
//        console.log(`Centre Stacks: ${JSON.stringify(game.centreStacks)}`);
        return game;        
    }
    getGames():Game[]{
        return this.games;
    }
}