import { SET_TOKEN } from '../actions/types';

const initialState = {
  token: null,
  authenticated: false
};

const user = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TOKEN:
      return {
        ...state,
        token: payload,
        authenticated: true
      };
    default:
      return state;
  }
};

export default user;
