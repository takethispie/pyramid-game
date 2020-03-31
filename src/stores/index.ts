import { createStore, applyMiddleware, Middleware, Action } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, defaultRootState } from './root.reducer'
import { ThunkJoinGame, ThunkKickInactivePlayers, ThunkKeepAlive } from './gameReducer/game.thunk'
import { KEEPALIVE_TIMEOUT_MS } from './gameReducer/game.state'
import { multiAction } from './multiActionMiddleware/multiAction.middleware'
import createSyncMiddleware from './syncMiddleware/sync.middleware'
import { Dispatch } from 'react'
import {
  GAME_ADD_PLAYER
  , GAME_REMOVE_PLAYER
  , GAME_ADD_TARGET
  , GAME_REMOVE_TARGET
  , GAME_ADD_ACCUSATION
  , GAME_REMOVE_ACCUSATION
  , GAME_ADD_SIPS
  , GAME_RESET_SIPS
  , GAME_KEEPALIVE
  , GAME_REMOVE_KEEPALIVE
} from './gameReducer/game.actions'
import { SYNC } from './syncMiddleware/sync.action'
import url from 'url'
import { MULTI_ACTION } from './multiActionMiddleware/multiAction.actions'

const currentUrl = url.parse(window.location.href)

const store = createStore(
  rootReducer,
  defaultRootState,
  composeWithDevTools(applyMiddleware(
    thunk
    , createSyncMiddleware(
      'ws://' + currentUrl.hostname + ':3200',
      getDispatch,
      action =>
        action.type == SYNC
        || action.type == GAME_ADD_PLAYER
        || action.type == GAME_REMOVE_PLAYER
        || action.type == GAME_ADD_TARGET
        || action.type == GAME_REMOVE_TARGET
        || action.type == GAME_ADD_ACCUSATION
        || action.type == GAME_REMOVE_ACCUSATION
        || action.type == GAME_ADD_SIPS
        || action.type == GAME_RESET_SIPS
        || action.type == GAME_KEEPALIVE
        || action.type == GAME_REMOVE_KEEPALIVE
        || action.type == MULTI_ACTION // TODO do not accept all multi action
    )
    , multiAction
  )),
)

function getDispatch(): Dispatch<Action> {
  return store.dispatch
}

export default store
