import {Move} from './Move';


export interface IMoveSubscriber{
    onNewMoves(move:Move[]);
    onUndo(move:Move[]);
    onUndoActivePlayer();
}