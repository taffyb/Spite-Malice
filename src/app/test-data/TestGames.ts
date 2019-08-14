import {Game} from '../classes/Game';
import {Player} from '../classes/Player';
import { v4 as uuid } from 'uuid';
import {PlayerPositionsEnum} from '../classes/Enums';
import {GamePositionsEnum} from '../classes/Enums';
import {CardsEnum} from '../classes/Enums';
import {SuitsEnum} from '../classes/Enums';


import {MovesService} from '../services/Moves.Service';

export class TestGames{
    games:Game[]=[];
   
    constructor(){
        this.games.push(this.testGame_1());
        this.games.push(this.testGame_2());
        this.games.push(this.testGame_3());
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
        
        let game:Game=new Game(uuid(),new MovesService());
        game.name="Test Recycle Centre Stack";
        let player:Player=new Player();
        
        player.name="Player 1";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.HEARTS+c.KING,
                               s.SPADES+c.QUEEN,
                               s.CLUBS+c.JACK,
                               s.DIAMONDS+c.TEN];
        player.cards[pp.HAND_1]=s.HEARTS+c.ACE;
        player.cards[pp.HAND_2]=s.HEARTS+c.THREE;
        player.cards[pp.HAND_3]=s.HEARTS+c.NINE;
        player.cards[pp.HAND_4]=s.HEARTS+c.JACK;
        player.cards[pp.HAND_5]=s.SPADES+c.FIVE;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.FIVE,s.SPADES+c.SIX];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.HEARTS+c.FOUR,s.SPADES+c.THREE,s.SPADES+c.TWO,s.DIAMONDS+c.ACE];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.NINE,s.CLUBS+c.EIGHT];
        player.cards[pp.STACK_4]=[c.NO_CARD,s.CLUBS+c.KING];
        player.isPrimary=true;
        game.players.push(player);
              
        player=new Player();
        player.name="Player 2";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.DIAMONDS+c.FOUR,
                               s.HEARTS+c.TWO];
        player.cards[pp.HAND_1]=s.CLUBS+c.ACE;
        player.cards[pp.HAND_2]=s.CLUBS+c.THREE;
        player.cards[pp.HAND_3]=s.SPADES+c.THREE;
        player.cards[pp.HAND_4]=s.HEARTS+c.EIGHT;
        player.cards[pp.HAND_5]=s.SPADES+c.QUEEN;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.SEVEN];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.SPADES+c.KING];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.TEN];
        player.cards[pp.STACK_4]=[c.NO_CARD,s.CLUBS+c.SIX];
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
        game.centreStacks[gp.STACK_2]=[c.NO_CARD];
        game.centreStacks[gp.STACK_3]=[c.NO_CARD];
        game.centreStacks[gp.STACK_4]=[c.NO_CARD];
        
        
        game.activePlayer=0;
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
        
        let game:Game=new Game(uuid(),new MovesService());
        game.name="Test Pending Discard";
        let player:Player=new Player();
        
        player.name="Player 1";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.HEARTS+c.KING,
                               s.SPADES+c.QUEEN,
                               s.CLUBS+c.JACK,
                               s.DIAMONDS+c.ACE];
        player.cards[pp.HAND_1]=s.HEARTS+c.ACE;
        player.cards[pp.HAND_2]=s.HEARTS+c.THREE;
        player.cards[pp.HAND_3]=s.HEARTS+c.NINE;
        player.cards[pp.HAND_4]=s.HEARTS+c.JACK;
        player.cards[pp.HAND_5]=s.SPADES+c.FIVE;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.FIVE];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.HEARTS+c.FOUR];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.NINE];
        player.cards[pp.STACK_4]=[c.NO_CARD];
        player.isPrimary=true;
        game.players.push(player);
              
        player=new Player();
        player.name="Player 2";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.DIAMONDS+c.FOUR,
                               s.HEARTS+c.TWO];
        player.cards[pp.HAND_1]=s.CLUBS+c.ACE;
        player.cards[pp.HAND_2]=s.CLUBS+c.THREE;
        player.cards[pp.HAND_3]=s.SPADES+c.THREE;
        player.cards[pp.HAND_4]=s.HEARTS+c.EIGHT;
        player.cards[pp.HAND_5]=s.SPADES+c.QUEEN;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.SEVEN];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.SPADES+c.KING];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.TEN];
        player.cards[pp.STACK_4]=[c.NO_CARD,s.CLUBS+c.SIX];
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
        game.centreStacks[gp.STACK_2]=[c.NO_CARD];
        game.centreStacks[gp.STACK_3]=[c.NO_CARD];
        game.centreStacks[gp.STACK_4]=[c.NO_CARD];
        
        
        game.activePlayer=0;
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
        
        let game:Game=new Game(uuid(),new MovesService());
        game.name="Winning Hand";
        let player:Player=new Player();
        
        player.name="Player 1";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.HEARTS+c.ACE];
        player.cards[pp.HAND_1]=s.HEARTS+c.ACE;
        player.cards[pp.HAND_2]=s.HEARTS+c.THREE;
        player.cards[pp.HAND_3]=s.HEARTS+c.NINE;
        player.cards[pp.HAND_4]=s.HEARTS+c.JACK;
        player.cards[pp.HAND_5]=s.SPADES+c.FIVE;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.FIVE,s.SPADES+c.SIX];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.HEARTS+c.FOUR,s.SPADES+c.THREE,s.SPADES+c.TWO,s.DIAMONDS+c.ACE];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.NINE,s.CLUBS+c.EIGHT];
        player.cards[pp.STACK_4]=[c.NO_CARD,s.CLUBS+c.KING];
        player.isPrimary=true;
        game.players.push(player);
              
        player=new Player();
        player.name="Player 2";
        player.cards[pp.PILE]=[c.NO_CARD,
                               s.DIAMONDS+c.FOUR,
                               s.HEARTS+c.TWO];
        player.cards[pp.HAND_1]=s.CLUBS+c.ACE;
        player.cards[pp.HAND_2]=s.CLUBS+c.THREE;
        player.cards[pp.HAND_3]=s.SPADES+c.THREE;
        player.cards[pp.HAND_4]=s.HEARTS+c.EIGHT;
        player.cards[pp.HAND_5]=s.SPADES+c.QUEEN;
        player.cards[pp.STACK_1]=[c.NO_CARD,s.CLUBS+c.SEVEN];
        player.cards[pp.STACK_2]=[c.NO_CARD,s.SPADES+c.KING];
        player.cards[pp.STACK_3]=[c.NO_CARD,s.SPADES+c.TEN];
        player.cards[pp.STACK_4]=[c.NO_CARD,s.CLUBS+c.SIX];
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
        game.centreStacks[gp.STACK_2]=[c.NO_CARD];
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