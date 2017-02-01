function generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}

const initialUserState = {
  username: "anonymous#" + generateUID(),
  usernameForm: {
    sending: false
  }
}

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'SETTING_USER':
      return {
        ...state,
        usernameForm: {
          ...state.usernameForm,
          sending: true
        }
      }
    case 'USER_SET':
      return {
        ...state,
        username: action.username,
        usernameForm: {
          ...state.usernameForm,
          sending: false
        }
      };
    case 'USERNAME_CHANGE_FAILED':
      return {
        ...state,
        usernameForm: {
          ...state.usernameForm,
          sending: false
        }
      }
    default:
      return state;
  }
}

export default userReducer;
