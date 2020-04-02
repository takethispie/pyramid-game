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
import { KEEPALIVE_TIMEOUT_MS } from "./game.state";
import { MultiAction } from "stores/multiActionMiddleware/multiAction.actions";

export const ThunkChooseTarget =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>) => {
            dispatch(GameAddTarget(playerWhoTargets, targetedPlayer))
        }

export const ThunkAccuse =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Targets[playerWhoTargets] === targetedPlayer) {
                dispatch(MultiAction([
                    GameAddAccusation(playerWhoTargets, targetedPlayer)
                    , GameRemoveTarget(playerWhoTargets)
                ]))
            }
        }

export const ThunkAcceptToDrink =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Targets[playerWhoTargets] === targetedPlayer) {
                dispatch(MultiAction([
                    GameAddSips(targetedPlayer, 1)
                    , GameRemoveTarget(playerWhoTargets)
                ]))
            }
        }

export const ThunkProveNotToLie =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Accusations[playerWhoTargets] === targetedPlayer) {
                dispatch(MultiAction([
                    GameAddSips(targetedPlayer, 2)
                    , GameRemoveAccusation(playerWhoTargets)
                ]))
            }
        }

export const ThunkAdmitToLying =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const state = getState().gameReducer
            if (state.Accusations[playerWhoTargets] === targetedPlayer) {
                dispatch(MultiAction([
                    GameAddSips(playerWhoTargets, 2)
                    , GameRemoveAccusation(playerWhoTargets)
                ]))
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
            dispatch(MultiAction([
                GameAddPlayer(getState().matchReducer.NickName)
                , GameKeepAlive(getState().matchReducer.NickName, new Date())
            ]))
        }

export const ThunkLeaveGame =
    (): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const nickName = getState().matchReducer.NickName
            dispatch(MultiAction(getPlayerLeaveCleanupActions(nickName, getState())))
        }

export const ThunkKickInactivePlayers =
    (now: Date = new Date()): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            for (const player of getState().gameReducer.Players) {
                if (
                    getState().gameReducer.KeepAlive[player] === undefined
                    || getState().gameReducer.KeepAlive[player].getTime() < now.getTime() - KEEPALIVE_TIMEOUT_MS
                ) {
                    dispatch(MultiAction(getPlayerLeaveCleanupActions(player, getState())))
                }
            }
        }

export const ThunkKeepAlive =
    (): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>, getState: () => RootState) => {
            const nickName = getState().matchReducer.NickName
            if ([...getState().gameReducer.Players].includes(nickName)) {
                dispatch(GameKeepAlive(nickName, new Date()))
            }
        }

function getPlayerLeaveCleanupActions(nickName: string, state: RootState): Action[] {
    let actions = []

    const targets = state.gameReducer.Targets
    const accusations = state.gameReducer.Accusations
    const sips = state.gameReducer.Sips
    const keepAlive = state.gameReducer.KeepAlive

    if (targets[nickName] !== undefined) {
        actions.push(GameRemoveTarget(nickName))
    }

    const playersWhoTarget = Object.keys(targets).filter(key => targets[key] === nickName)
    for (const playerWhoTargets of playersWhoTarget) {
        actions.push(GameRemoveTarget(playerWhoTargets))
    }

    if (accusations[nickName] !== undefined) {
        actions.push(GameRemoveAccusation(nickName))
    }

    const accusedPlayers = Object.keys(accusations).filter(key => accusations[key] === nickName)
    for (const accusedPlayer of accusedPlayers) {
        actions.push(GameRemoveAccusation(accusedPlayer))
    }

    if (sips[nickName] > 0) {
        actions.push(GameResetSips(nickName))
    }

    if (keepAlive[nickName] !== undefined) {
        actions.push(GameRemoveKeepAlive(nickName))
    }

    actions.push(GameRemovePlayer(nickName))

    return actions
}
