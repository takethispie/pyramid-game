import { ThunkAction } from "redux-thunk";
import { Action, Dispatch } from "redux";
import {
    GameAddTarget,
    GameAddAccusation,
    GameRemoveTarget,
    GameAddSips,
    GameRemoveAccusation,
    GameResetSips,
    GameAddPlayer,
    GameRemovePlayer,
    GameKeepAlive,
    GameRemoveKeepAlive
} from "./game.actions";
import { RootState } from "stores/root.reducer";
import { KEEPALIVE_TIMEOUT_MS, getStep } from "./game.state";

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
                dispatch(GameAddAccusation(playerWhoTargets, targetedPlayer));
                dispatch(GameRemoveTarget(playerWhoTargets));
            }
        }

export const ThunkAcceptToDrink =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Targets[playerWhoTargets] == targetedPlayer) {
                dispatch(GameAddSips(targetedPlayer, 1));
                dispatch(GameRemoveTarget(playerWhoTargets));
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
                dispatch(GameAddSips(playerWhoTargets, 2));
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
            dispatch(GameAddPlayer(getState().matchReducer.NickName));
            dispatch(GameKeepAlive(getState().matchReducer.NickName, new Date))
        }

export const ThunkLeaveGame =
    (): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const nickName = getState().matchReducer.NickName
            let actions = getPlayerLeaveCleanupActions(nickName, getState());
            actions.forEach(action => dispatch(action));
        }

export const ThunkKickInactivePlayers =
    (now: Date = new Date): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            for (const player of getState().gameReducer.Players) {
                if (
                    getState().gameReducer.KeepAlive[player] == undefined
                    || getState().gameReducer.KeepAlive[player].getTime() < now.getTime() - KEEPALIVE_TIMEOUT_MS
                ) {
                    let actions = getPlayerLeaveCleanupActions(player, getState());
                    actions.forEach(action => dispatch(action));
                }
            }
        }

export const ThunkKeepAlive =
    (): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const nickName = getState().matchReducer.NickName
            if ([...getState().gameReducer.Players].includes(nickName)) {
                dispatch(GameKeepAlive(nickName, new Date))
            }
        }

function getPlayerLeaveCleanupActions(nickName: string, state: RootState): Action[] {
    let actions = []

    const targets = state.gameReducer.Targets
    const accusations = state.gameReducer.Accusations
    const sips = state.gameReducer.Sips
    const keepAlive = state.gameReducer.KeepAlive

    if (targets[nickName] != undefined) {
        actions.push(GameRemoveTarget(nickName))
    }

    const playersWhoTarget = Object.keys(targets).filter(key => targets[key] == nickName)
    for (const playerWhoTargets of playersWhoTarget) {
        actions.push(GameRemoveTarget(playerWhoTargets))
    }

    if (accusations[nickName] != undefined) {
        actions.push(GameRemoveAccusation(nickName))
    }

    const accusedPlayers = Object.keys(accusations).filter(key => accusations[key] == nickName)
    for (const accusedPlayer of accusedPlayers) {
        actions.push(GameRemoveAccusation(accusedPlayer))
    }

    if (sips[nickName] > 0) {
        actions.push(GameResetSips(nickName))
    }

    if (keepAlive[nickName] != undefined) {
        actions.push(GameRemoveKeepAlive(nickName))
    }

    actions.push(GameRemovePlayer(nickName))

    return actions
}
