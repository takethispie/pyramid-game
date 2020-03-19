import { GameState, GameStep } from './game.state';
import {
    GameActionsTypes,
    GAME_CHOOSE_TARGET,
    GAME_ACCUSE,
    GAME_ACCEPT_TO_DRINK,
    GAME_DRINK
} from './game.actions';

export const defaultGameState: GameState = {
    CurrentStep: GameStep.ChooseTarget,
    Players: new Set,
    Targets: {},
    Accusations: {},
    Sips: {},
    DoneDrinking: new Set
};

const GameReducer = (state: GameState = defaultGameState, action: GameActionsTypes): GameState => {
    switch (action.type) {

        case GAME_CHOOSE_TARGET:
            {
                let newState = { ...state }

                newState.Targets[action.payload.playerWhoChooses] = action.payload.targetedPlayer

                // Each player targeted someone
                if ([...newState.Players].every(x => x in newState.Targets)) {
                    newState.CurrentStep = GameStep.Accuse
                }

                return newState
            }

        case GAME_ACCUSE:
            {
                // A player A can accuse another player B of lying only if B targeted A
                if (state.Targets[action.payload.accusedPlayer] !== action.payload.playerWhoAccuses) {
                    return state
                }
                let newTargets = { ...state.Targets }
                delete newTargets[action.payload.accusedPlayer]
                let newAccusations = { ...state.Accusations }
                newAccusations[action.payload.playerWhoAccuses] = action.payload.accusedPlayer
                let newStep = state.CurrentStep
                if (Object.keys(newTargets).length == 0) {
                    newStep = GameStep.Deny
                }
                return {
                    ...state
                    , CurrentStep: newStep
                    , Targets: newTargets
                    , Accusations: newAccusations
                }
            }

        case GAME_ACCEPT_TO_DRINK:
            {
                let newTargets = { ...state.Targets }
                delete newTargets[action.payload.playerWhoTargets]

                let newSips = { ...state.Sips }
                if (!(action.payload.playerWhoAccepts in newSips)) {
                    newSips[action.payload.playerWhoAccepts] = 0
                }
                newSips[action.payload.playerWhoAccepts]++

                let newStep = state.CurrentStep
                if (Object.keys(newTargets).length == 0) {
                    if (Object.keys(state.Accusations).length == 0) {
                        newStep = GameStep.Drink
                        state.Players.forEach(player => {
                            if (!(player in newSips)) {
                                newSips[player] = 0
                            }
                        });
                    } else {
                        newStep = GameStep.Deny
                    }
                }

                return {
                    ...state
                    , CurrentStep: newStep
                    , Targets: newTargets
                    , Sips: newSips
                }
            }

        case GAME_DRINK:
            {
                let newDoneDrinking = new Set([...state.DoneDrinking, action.payload.player])
                let remainingToDrink = new Set([...state.Players].filter(x => !newDoneDrinking.has(x)))
                if (remainingToDrink.size == 0) {
                    return {
                        ...state
                        , CurrentStep: GameStep.ChooseTarget
                        , DoneDrinking: new Set
                    };
                }
                else {
                    return {
                        ...state
                        , DoneDrinking: newDoneDrinking
                    };
                }
            }

        default:
            return state;
    }
};

export default GameReducer;