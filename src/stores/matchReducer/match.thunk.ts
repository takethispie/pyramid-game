import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { MatchState } from "./match.state";
import { ConnectMatch, ConnectMatchError, ConnectMatchSuccess } from "./match.actions";
import { IsMatchAlreadyStarted, DoesMatchExists, DoesNicknameAlreadyExistsInMatch, ConnectToMatch } from "services/match.service";

export const ThunkConnectToMatch = (matchId: string, nickname: string): ThunkAction<void, MatchState, unknown, Action<string>> => async dispatch => {
    dispatch(ConnectMatch(matchId, nickname));
    try {
        let exists = await DoesMatchExists(matchId);
        if(!exists) {
            dispatch(ConnectMatchError("cette partie n'existe pas ou est terminée!"));
            return;
        }
        let isPlaying = await IsMatchAlreadyStarted(matchId);
        if(isPlaying) {
            dispatch(ConnectMatchError("cette partie est déjà en cours de jeu!"));
            return;
        }
        let isNickNameTaken = await DoesNicknameAlreadyExistsInMatch(matchId, nickname);
        if(isNickNameTaken) {
            dispatch(ConnectMatchError("Ce pseudo est déjà utilisé dans cette partie!"));
            return;
        }
        let connected = await ConnectToMatch(matchId, nickname);
        dispatch(ConnectMatchSuccess(matchId));
    } catch (error) {
        dispatch(ConnectMatchError(error));
    }
}