import { createStore, applyMiddleware, Middleware, Action } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, defaultRootState } from './root.reducer'
import { ThunkJoinGame, ThunkKickInactivePlayers, ThunkKeepAlive } from './gameReducer/game.thunk'
import { KEEPALIVE_TIMEOUT_MS } from './gameReducer/game.state'
import { multiAction } from './multiActionMiddleware/multiAction.middleware'
import createSyncMiddleware from './syncMiddleware/sync.middleware'
import { Dispatch } from 'react'

const store = createStore(
  rootReducer,
  defaultRootState,
  composeWithDevTools(applyMiddleware(
    thunk
    , createSyncMiddleware('ws://localhost:3200', getDispatch)
    , multiAction
  )),
)

function getDispatch(): Dispatch<Action> {
  return store.dispatch
}

// TODO:
// const playerName = 'player' + Math.round(Math.random() * 10000)
// store.dispatch(ChangeNickName(playerName))
ThunkJoinGame()(store.dispatch, store.getState, undefined)

setInterval(() => {
  ThunkKeepAlive()(store.dispatch, store.getState, undefined)
  ThunkKickInactivePlayers()(store.dispatch, store.getState, undefined)
}, KEEPALIVE_TIMEOUT_MS / 2)

export default store
