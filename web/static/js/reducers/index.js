import userReducer from './user';
import userListReducer from './userList';
import socketReducer from './socket';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  socket: socketReducer,
  user: userReducer,
  userList: userListReducer
});

export default reducers;
