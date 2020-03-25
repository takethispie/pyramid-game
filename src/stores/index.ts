import { createStore, applyMiddleware, Middleware, Action } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, defaultRootState, Sync } from './root.reducer'
import axios from 'axios'
import { GameActionsTypes } from './gameReducer/game.actions'
import { ThunkJoinGame } from './gameReducer/game.thunk'
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
      console.log('begin ' + action.type + ' (' + actionCount + ')')
      return push(actionCount, action).then(
        () => {
          if (action.type !== 'SYNC') {
            next(action)
            actionCount++
            console.log('success ' + action.type + ', index = ' + actionCount)
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
                console.log('error ' + action.type + ', index = ' + actionCount + ' (applyed ' + conflict.type + ')')
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

const store = createStore(
  rootReducer,
  defaultRootState,
  composeWithDevTools(applyMiddleware(
    thunk,
    createActionSync(pushGameAction)
  )),
)

// Fetch the store on start
store.dispatch(Sync())

// TODO:
// const playerName = 'player' + Math.round(Math.random() * 10000)
// store.dispatch(ChangeNickName(playerName))
ThunkJoinGame()(store.dispatch, store.getState, undefined)

export default store
