import userReducer from './user';
import userListReducer from './userList';
import socketReducer from './socket';
import messagesReducer from './messages';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  socket: socketReducer,
  user: userReducer,
  userList: userListReducer,
  messages: messagesReducer
});

export default reducers;
