import { MatchState } from './match.state';
import { MatchActionsTypes, MATCH_CHANGE_NICKNAME } from './match.actions';
import GameReducer, { defaultGameState } from 'stores/gameReducer/game.reducer';
import { GameActionsTypes } from 'stores/gameReducer/game.actions';

export const defaultMatchState: MatchState = {
    MatchId: "",
    IsInMatch: false,
    NickName: 'player' + Math.round(Math.random() * 10000),
    ErrorMessage: "",
    Game: defaultGameState
};

const MatchReducer = (state: MatchState = defaultMatchState, action: MatchActionsTypes): MatchState => {
    switch (action.type) {
        case MATCH_CHANGE_NICKNAME:
            return {
                ...state
                , NickName: action.payload.nickName
            }
        default:
            return state
    }
};

export default MatchReducer;