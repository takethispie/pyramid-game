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

    // TODO: is there a better way to do this?
    let gameState = { ...state.Game }
    let gameAction = action as GameActionsTypes
    if (gameAction.type) {
        gameState = GameReducer(gameState, gameAction)
    }

    switch (action.type) {
        default:
            return {
                ...state,
                Game: gameState
            }
    }
};

export default MatchReducer;