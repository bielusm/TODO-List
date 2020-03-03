import { SET_TODOS, REMOVE_TODO } from '../actions/types';

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

    case REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== payload)
      };
    default:
      return state;
  }
};

export default todo;
