const initialState = {
  socket: null,
  channel: null,
  channelConfigured: false
}

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SOCKET_CONNECTED':
      return {
        ...state,
        socket: action.socket
      };
    case 'CHANNEL_JOINED':
      return {
        ...state,
        channel: action.channel
      };
    case 'CHANNEL_CONFIGURED':
      return {
        ...state,
        channelConfigured: true
      }
    default:
      return state;
  }
}

export default socketReducer;
