import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { GameState, GameStep } from "./game.state";
import { Action, Dispatch } from "redux";
import {
    GameAddTarget,
    GameSetStep,
    GameAddAccusation,
    GameRemoveTarget,
    GameAddSips,
    GameAddDoneDrinking,
    GameResetDoneDrinking
} from "./game.actions";

export const ThunkChooseTarget =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, GameState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => GameState) => {
            const state = getState()
            const players = [...state.Players]
            const playersDoneTargeting = [...Object.keys(state.Targets), playerWhoTargets]

            dispatch(GameAddTarget(playerWhoTargets, targetedPlayer))
            if (players.every(x => playersDoneTargeting.includes(x))) {
                dispatch(GameSetStep(GameStep.Accuse))
            }
        }

export const ThunkAccuse =
    (playerWhoAccuses: string, accusedPlayer: string): ThunkAction<void, GameState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => GameState) => {
            const state = getState()
            const playersWhoTarget = Object.keys(state.Targets)

            if (state.Targets[accusedPlayer] == playerWhoAccuses) {
                dispatch(GameAddAccusation(playerWhoAccuses, accusedPlayer))
                dispatch(GameRemoveTarget(accusedPlayer))

                // The last targeted players chooses to accuse
                if (playersWhoTarget.length == 1 && playersWhoTarget[0] == accusedPlayer) {
                    dispatch(GameSetStep(GameStep.Deny))
                }
            }
        }

export const ThunkAcceptToDrink =
    (playerWhoAccepts: string, playerWhoTargets: string): ThunkAction<void, GameState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => GameState) => {
            const state = getState()
            const playersWhoTarget = Object.keys(state.Targets)

            if (state.Targets[playerWhoTargets] == playerWhoAccepts) {
                dispatch(GameAddSips(playerWhoAccepts, 1))
                dispatch(GameRemoveTarget(playerWhoTargets))

                // The last targeted players chooses to drink
                if (playersWhoTarget.length == 1 && playersWhoTarget[0] == playerWhoTargets) {
                    // There is no accusations -> drinking step
                    if (Object.keys(state.Accusations).length == 0) {
                        dispatch(GameSetStep(GameStep.Drink))
                    } else {
                        dispatch(GameSetStep(GameStep.Deny))
                    }
                }
            }
        }

export const ThunkDrink =
    (player: string): ThunkAction<void, GameState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => GameState) => {
            const state = getState()
            const players = [...state.Players]
            const playersDoneDrinking = [...state.DoneDrinking, player]

            dispatch(GameAddDoneDrinking(player))
            if (players.every(x => playersDoneDrinking.includes(x))) {
                dispatch(GameSetStep(GameStep.ChooseTarget))
                dispatch(GameResetDoneDrinking())
            }
        }
