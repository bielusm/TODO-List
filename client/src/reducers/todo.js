import { SET_TODOS } from '../actions/types';

export const initialState = {
  todos: []
};

const todo = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_TODOS:
      return {
        ...state,
        todos: payload
      };
    default:
      return state;
  }
};

export default todo;
