import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import blogReducer from './reducers/blogs'
import notificationReducer from './reducers/notifications'
import userReducer from './reducers/user'
import usersReducer from './reducers/users'

const reducer = combineReducers({
  blog : blogReducer,
  message: notificationReducer,
  user: userReducer,
  users: usersReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
      applyMiddleware(thunk)
  )
)

export default store