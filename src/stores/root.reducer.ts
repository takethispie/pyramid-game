import { combineReducers } from 'redux'
import MatchReducer, { defaultMatchState } from './matchReducer/match.reducer'
import BoardReducer, { defaultBoardState } from './boardReducer/board.reducer'
import HandReducer, { defaultHandState } from './handReducer/hand.reducer'


export const defaultRootState = {
    matchReducer: defaultMatchState,
    boardReducer: defaultBoardState,
    handReducer: defaultHandState,
}

export const rootReducer = combineReducers({
    matchReducer: MatchReducer,
    boardReducer: BoardReducer,
    handReducer: HandReducer,
})

export type RootState = ReturnType<typeof rootReducer>