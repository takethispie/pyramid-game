import { createStore, applyMiddleware, Middleware, Action } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, defaultRootState, MULTI_ACTION, SYNC, Sync } from './root.reducer'
import { ThunkJoinGame, ThunkLeaveGame, ThunkKickInactivePlayers, ThunkKeepAlive } from './gameReducer/game.thunk'
import { ChangeNickName } from './matchReducer/match.actions'
import { KEEPALIVE_TIMEOUT_MS } from './gameReducer/game.state'

const ws = new WebSocket('ws://localhost:3200');

ws.onmessage = function (event) {
  store.dispatch(Sync(JSON.parse(event.data)))
}

const sync: Middleware = () => next => action => {
  const send = async (action: Action) => {
    while (ws.readyState === 0) {
      await new Promise(r => setTimeout(r, 200))
    }
    ws.send(JSON.stringify(action))
  }
  if (action.type === SYNC) {
    next(action.payload.action)
  } else {
    send(action)
    next(action)
  }
}

const multiAction: Middleware = () => next => action => {
  if (action.type == MULTI_ACTION) {
    for (const subAction of action.payload.actions) {
      next(subAction)
    }
  } else {
    next(action)
  }
}

const store = createStore(
  rootReducer,
  defaultRootState,
  composeWithDevTools(applyMiddleware(
    thunk
    , sync
    , multiAction
  )),
)

// TODO:
// const playerName = 'player' + Math.round(Math.random() * 10000)
// store.dispatch(ChangeNickName(playerName))
ThunkJoinGame()(store.dispatch, store.getState, undefined)

setInterval(() => {
  ThunkKeepAlive()(store.dispatch, store.getState, undefined)
  ThunkKickInactivePlayers()(store.dispatch, store.getState, undefined)
}, KEEPALIVE_TIMEOUT_MS / 2)

export default store
