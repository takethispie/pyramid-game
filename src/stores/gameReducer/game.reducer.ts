import { GameState, GameStep } from './game.state';
import {
    GameActionsTypes,
    GAME_ADD_PLAYER,
    GAME_REMOVE_PLAYER,
} from './game.actions';

export const defaultGameState: GameState = {
    Players: [],
    Sips: {}
};

const GameReducer = (state: GameState = defaultGameState, action: GameActionsTypes): GameState => {
    switch (action.type) {
        case GAME_ADD_PLAYER:
            return {
                ...state
                , Players: [
                    ...state.Players
                    , action.payload.player
                ]
            }

        case GAME_REMOVE_PLAYER:
            return {
                ...state
                , Players: [...state.Players].filter(player => player != action.payload.player)
            }

        

        default:
            return state;
    }
};

export default GameReducer;