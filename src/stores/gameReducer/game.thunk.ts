import { ThunkAction } from "redux-thunk";
import { Action, Dispatch } from "redux";
import {
    GameAddSips,
    GameResetSips,
    GameAddPlayer,
    GameRemovePlayer,
} from "./game.actions";
import { RootState } from "stores/root.reducer";

export const ThunkChooseTarget =
    (playerWhoTargets: string, targetedPlayer: string): ThunkAction<void, RootState, unknown, Action<string>> =>
        (dispatch: Dispatch<Action>) => {
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
        }


