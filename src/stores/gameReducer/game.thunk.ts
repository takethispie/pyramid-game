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
    GameResetDoneDrinking,
    GameRemoveAccusation
} from "./game.actions";
import { RootState } from "stores/root.reducer";

export const ThunkChooseTarget =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            const players = [...state.Players]
            const playersDoneTargeting = [...Object.keys(state.Targets), playerWhoTargets]

            dispatch(GameAddTarget(playerWhoTargets, targetedPlayer))
            if (players.every(x => playersDoneTargeting.includes(x))) {
                dispatch(GameSetStep(GameStep.Accuse))
            }
        }

export const ThunkAccuse =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            const playersWhoTarget = Object.keys(state.Targets)

            if (state.Targets[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddAccusation(playerWhoTargets, targetedPlayer))
                dispatch(GameRemoveTarget(playerWhoTargets))

                // The last targeted players chooses to accuse
                if (playersWhoTarget.length == 1 && playersWhoTarget[0] == playerWhoTargets) {
                    dispatch(GameSetStep(GameStep.Deny))
                }
            }
        }

export const ThunkAcceptToDrink =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            const playersWhoTarget = Object.keys(state.Targets)

            if (state.Targets[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddSips(targetedPlayer, 1))
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

export const ThunkProveNotToLie =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer

            if (state.Accusations[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddSips(targetedPlayer, 2))
                dispatch(GameRemoveAccusation(playerWhoTargets))

                // Last accusation is being resolved -> drinking step
                if (Object.keys(state.Accusations).length == 1) {
                    dispatch(GameSetStep(GameStep.Drink))
                }
            }
        }

export const ThunkAdmitToLying =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer

            if (state.Accusations[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddSips(playerWhoTargets, 2))
                dispatch(GameRemoveAccusation(playerWhoTargets))

                // Last accusation is being resolved -> drinking step
                if (Object.keys(state.Accusations).length == 1) {
                    dispatch(GameSetStep(GameStep.Drink))
                }
            }
        }

export const ThunkDrink =
    (player: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            const players = [...state.Players]
            const playersDoneDrinking = [...state.DoneDrinking, player]

            dispatch(GameAddDoneDrinking(player))
            if (players.every(x => playersDoneDrinking.includes(x))) {
                dispatch(GameSetStep(GameStep.ChooseTarget))
                dispatch(GameResetDoneDrinking())
            }
        }
