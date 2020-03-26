import { combineReducers, Action } from 'redux'
import MatchReducer, { defaultMatchState } from './matchReducer/match.reducer'
import BoardReducer, { defaultBoardState } from './boardReducer/board.reducer'
import GameReducer, { defaultGameState } from './gameReducer/game.reducer'
import SyncReducer from './syncMiddleware/sync.reducer'


export const defaultRootState = {
    matchReducer: defaultMatchState,
    boardReducer: defaultBoardState,
    gameReducer: defaultGameState
}

export const rootReducer = combineReducers({
    matchReducer: MatchReducer,
    boardReducer: BoardReducer,
    gameReducer: GameReducer,
    sync: SyncReducer
})

export type RootState = ReturnType<typeof rootReducer>