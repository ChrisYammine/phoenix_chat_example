import {Socket, LongPoller} from "phoenix"

export function connectWebsocket() {
  return dispatch => {
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    });
    socket.onOpen((_) => {
      dispatch({type: 'SOCKET_CONNECTED', socket: socket})
      dispatch(joinChannel(socket));
    });
    socket.connect();
  }
}

const joinChannel = (socket) => {
  return (dispatch, getState) => {
    const state = getState();
    const userName = state.user.username;

    let chan = socket.channel("rooms:lobby", {user: userName});
    chan.join()
    .receive("ok", () => console.log("Joined rooms:lobby"))
    .receive("ignore", () => console.log("Ignoring unrecognized channel"))

    dispatch({type: 'CHANNEL_JOINED', channel: chan});
    dispatch(configureChannelCallbacks(chan));
  }
}

const configureChannelCallbacks = (channel) => {
  return (dispatch) => {
    channel.on("user:set", msg => {
      dispatch({ type: 'USER_SET', username: msg.user});
    });

    channel.on("new:msg", msg => {
      dispatch({ type: 'NEW_MESSAGE', message: msg });
    });

    channel.on("user:entered", msg => {
      dispatch({ type: 'USER_ENTERED', username: msg.user.name, color: msg.user.color });
    });

    channel.on("user:set_username", msg => {
      dispatch({
        type: 'USERNAME_CHANGED',
        previous: msg.previous,
        next: msg.next
      });
    })

    channel.on("user:set_failed", msg => {
      dispatch({
        type: 'USERNAME_CHANGE_FAILED',
        error: msg.error
      })
    })

    channel.on("user:left", msg => {
      dispatch({ type: 'USER_LEFT', user: msg.user });
    });

    dispatch({type: 'CHANNEL_CONFIGURED'});
  }
}

export function setUsername(username) {
  return (dispatch, getState) => {
    if (username.length < 1) {
      return
    }
    const state = getState();
    const channel = state.socket.channel;
    channel.push("user:set_username", {username: username});
    dispatch({type: 'SETTING_USER'});
  }
}

export function changeUserForm(contents) {
  return (dispatch) => {
    dispatch({type: 'USER_FORM_CHANGE', content: contents});
  }
}

export function sendMessage(message) {
  return (dispatch, getState) => {
    if (message.length < 1) {
      return
    };
    const state = getState();
    const channel = state.socket.channel;
    const user    = state.user.username;
    channel.push("new:msg", {user: user, body: message});
    dispatch({type: 'SENDING_MESSAGE'});
  }
}
