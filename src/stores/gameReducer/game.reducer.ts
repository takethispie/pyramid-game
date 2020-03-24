import { GameState, GameStep } from './game.state';
import {
    GameActionsTypes,
    GAME_ADD_TARGET,
    GAME_REMOVE_TARGET,
    GAME_ADD_ACCUSATION,
    GAME_REMOVE_ACCUSATION,
    GAME_ADD_SIPS,
    GAME_RESET_SIPS,
    GAME_ADD_PLAYER,
    GAME_REMOVE_PLAYER
} from './game.actions';

export const defaultGameState: GameState = {
    Players: new Set
    , Targets: {}
    , Accusations: {}
    , Sips: {}
};

const GameReducer = (state: GameState = defaultGameState, action: GameActionsTypes): GameState => {
    switch (action.type) {

        case GAME_ADD_PLAYER:
            return {
                ...state
                , Players: new Set([
                    ...state.Players
                    , action.payload.player
                ])
            }

        case GAME_REMOVE_PLAYER:
            return {
                ...state
                , Players: new Set([...state.Players].filter(player => player != action.payload.player))
            }

        case GAME_ADD_TARGET:
            return {
                ...state
                , Targets: {
                    ...state.Targets
                    , [action.payload.playerWhoTargets]: action.payload.targetedPlayer
                }
            }

        case GAME_REMOVE_TARGET:
            let newTargets = { ...state.Targets }
            delete newTargets[action.payload.playerWhoTargets]
            return {
                ...state
                , Targets: newTargets
            }

        case GAME_ADD_ACCUSATION:
            return {
                ...state
                , Accusations: {
                    ...state.Accusations
                    , [action.payload.accusedPlayer]: action.payload.playerWhoAccuses
                }
            }

        case GAME_REMOVE_ACCUSATION:
            let newAccusations = { ...state.Accusations }
            delete newAccusations[action.payload.accusedPlayer]
            return {
                ...state
                , Accusations: newAccusations
            }

        case GAME_ADD_SIPS:
            {
                let newSips = { ...state.Sips }
                if (!(action.payload.player in newSips)) {
                    newSips[action.payload.player] = 0
                }
                newSips[action.payload.player] += action.payload.numberOfSips
                return {
                    ...state
                    , Sips: newSips
                }
            }

        case GAME_RESET_SIPS:
            {
                let newSips = { ...state.Sips }
                if (!(action.payload.player in newSips)) {
                    newSips[action.payload.player] = 0
                }
                newSips[action.payload.player] = 0
                return {
                    ...state
                    , Sips: newSips
                }
            }

        default:
            return state;
    }
};

export default GameReducer;