const initialState = {
  messages: [],
  sending: false
}

const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SENDING_MESSAGE':
      return {
        ...state,
        sending: true
      };
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          action.message
        ]
      };
    case 'USER_ENTERED':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            user: 'SYSTEM',
            body: `${action.username} has connected.`
          }
        ]
      };
    case 'USERNAME_CHANGED':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            user: 'SYSTEM',
            body: `${action.previous} changed name to ${action.next}`
          }
        ]
      };
    case 'USER_LEFT':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            user: 'SYSTEM',
            body: `${action.user} has left.`
          }
        ]
      }
    default:
      return state;
  }
}

export default messagesReducer;
