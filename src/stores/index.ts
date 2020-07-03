import { createStore, applyMiddleware, Middleware, Action } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { rootReducer, defaultRootState } from './root.reducer'
import { Dispatch } from 'react'

const store = createStore(
  rootReducer,
  defaultRootState,
  composeWithDevTools(applyMiddleware(
    thunk
  )),
)

function getDispatch(): Dispatch<Action> {
  return store.dispatch
}

export default store
