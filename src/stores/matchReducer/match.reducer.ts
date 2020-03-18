import { MatchState } from './match.state';
import { MatchActionsTypes } from './match.actions';

export const defaultMatchState: MatchState = {
    MatchId: "",
    IsInMatch: false,
    NickName: "",
    ErrorMessage: ""
};

const MatchReducer = (state: MatchState = defaultMatchState, action: MatchActionsTypes): MatchState => {
    switch (action.type) {
        default:
            return state;
    }
};

export default MatchReducer;