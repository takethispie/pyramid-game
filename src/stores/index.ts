import { createStore, applyMiddleware, Middleware, Action } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, defaultRootState, Sync, MULTI_ACTION } from './root.reducer'
import axios from 'axios'
import { GameActionsTypes } from './gameReducer/game.actions'
import { ThunkJoinGame, ThunkLeaveGame } from './gameReducer/game.thunk'
import { ChangeNickName } from './matchReducer/match.actions'

const ws = new WebSocket('ws://localhost:3201');

ws.onmessage = function (event) {
  if (event.data == 'SYNC') {
    store.dispatch(Sync())
  }
}

function createActionSync<ActionType>(push: (index: number, action: ActionType) => Promise<any>, initialActionCount = 0): Middleware {
  let actionCount = initialActionCount

  return () => next => action => {
    const process = (): Promise<void> => {
      return push(actionCount, action).then(
        () => {
          if (action.type !== 'SYNC') {
            next(action)
            actionCount++
            console.debug(store.getState())
          }
        },
        error => {
          if (error.response.status == 409) {
            let currentConflictIndex = error.conflicts.index
            error.conflicts.actions.forEach((conflict: Action) => {
              if (actionCount == currentConflictIndex) {
                next(conflict)
                actionCount++
              }
              currentConflictIndex++
            })
            if (action.type !== 'SYNC') {
              return process()
            }
          }
        }
      )
    }

    return process()
  }
}

const pushGameAction = (index: number, action: GameActionsTypes): Promise<any> =>
  axios.post('http://localhost:3000/actions', { index, action })
    .catch(error => {
      throw Object.assign(error, { conflicts: error.response.data });
    })

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
    , createActionSync(pushGameAction)
    , multiAction
  )),
)

// Fetch the store on start
store.dispatch(Sync())

// TODO:
// const playerName = 'player' + Math.round(Math.random() * 10000)
// store.dispatch(ChangeNickName(playerName))
ThunkJoinGame()(store.dispatch, store.getState, undefined)

export default store
