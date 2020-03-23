import { combineReducers } from 'redux'
import MatchReducer, { defaultMatchState } from './matchReducer/match.reducer'
import BoardReducer, { defaultBoardState } from './boardReducer/board.reducer'
import GameReducer, { defaultGameState } from './gameReducer/game.reducer'


export const defaultRootState = {
    matchReducer: defaultMatchState,
    boardReducer: defaultBoardState,
    gameReducer: defaultGameState
}

interface SyncState { }

const SYNC = 'SYNC'

interface SyncAction {
    type: typeof SYNC,
    payload: {}
}

export function Sync(): SyncAction {
    return {
        type: SYNC,
        payload: {}
    }
}

const SyncReducer = (state: SyncState = {}, action: SyncAction): SyncState => {
    switch (action.type) {
        default:
            return state
    }
};

export const rootReducer = combineReducers({
    matchReducer: MatchReducer,
    boardReducer: BoardReducer,
    gameReducer: GameReducer,
    syncReducer: SyncReducer
})

export type RootState = ReturnType<typeof rootReducer>