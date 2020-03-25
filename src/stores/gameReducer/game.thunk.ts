import { ThunkAction } from "redux-thunk";
import { Action, Dispatch } from "redux";
import {
    GameAddTarget,
    GameAddAccusation,
    GameRemoveTarget,
    GameAddSips,
    GameRemoveAccusation,
    GameResetSips,
    GameAddPlayer
} from "./game.actions";
import { RootState } from "stores/root.reducer";

export const ThunkChooseTarget =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>) => {
            dispatch(GameAddTarget(playerWhoTargets, targetedPlayer))
        }

export const ThunkAccuse =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Targets[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddAccusation(playerWhoTargets, targetedPlayer))
                dispatch(GameRemoveTarget(playerWhoTargets))
            }
        }

export const ThunkAcceptToDrink =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Targets[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddSips(targetedPlayer, 1))
                dispatch(GameRemoveTarget(playerWhoTargets))
            }
        }

export const ThunkProveNotToLie =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Accusations[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddSips(targetedPlayer, 2))
                dispatch(GameRemoveAccusation(playerWhoTargets))
            }
        }

export const ThunkAdmitToLying =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Accusations[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddSips(playerWhoTargets, 2))
                dispatch(GameRemoveAccusation(playerWhoTargets))
            }
        }

export const ThunkDrink =
    (player: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>) => {
            dispatch(GameResetSips(player))
        }

export const ThunkJoinGame =
    (): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            dispatch(GameAddPlayer(getState().matchReducer.NickName))
        }
