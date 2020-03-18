import { combineReducers } from 'redux'
import MatchReducer, { defaultMatchState } from './matchReducer/match.reducer'


export const defaultRootState = {
    matchReducer: defaultMatchState
}

export const rootReducer = combineReducers({
    matchReducer: MatchReducer
})

export type RootState = ReturnType<typeof rootReducer>