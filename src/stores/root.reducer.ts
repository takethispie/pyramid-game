import { combineReducers } from 'redux'
import MatchReducer, { defaultMatchState } from './matchReducer/match.reducer'
import BoardReducer, { defaultBoardState } from './boardReducer/board.reducer'
import GameReducer from './gameReducer/game.reducer'


export const defaultRootState = {
    matchReducer: defaultMatchState,
    boardReducer: defaultBoardState,
}

export const rootReducer = combineReducers({
    matchReducer: MatchReducer,
    boardReducer: BoardReducer,
    gameReducer: GameReducer,
})

export type RootState = ReturnType<typeof rootReducer>