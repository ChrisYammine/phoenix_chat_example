const randomNumberBetween = (min, max) => {
  let minimum = Math.ceil(min);
  let maximum = Math.floor(max);
  return Math.floor(Math.random() * (maximum - minimum)) + minimum;
}

const initialUserState = {
  username: "anonymous#" + randomNumberBetween(3, 20000),
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
    default:
      return state;
  }
}

export default userReducer;
