import { MatchState } from './match.state';
import { MatchActionsTypes } from './match.actions';
import GameReducer, { defaultGameState } from 'stores/gameReducer/game.reducer';
import { GameActionsTypes } from 'stores/gameReducer/game.actions';

export const defaultMatchState: MatchState = {
    MatchId: "",
    IsInMatch: false,
    NickName: "",
    ErrorMessage: "",
    Game: defaultGameState
};

const MatchReducer = (state: MatchState = defaultMatchState, action: MatchActionsTypes): MatchState => {
    switch (action.type) {
        default:
            return state
    }
};

export default MatchReducer;