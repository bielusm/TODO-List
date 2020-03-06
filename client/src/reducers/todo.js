import { SET_TODOS, REMOVE_TODO, SET_TODO } from '../actions/types';

export const initialState = {
  todos: [],
  todo: undefined
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

    case SET_TODO:
      return {
        ...state,
        todo: payload
      };
    default:
      return state;
  }
};

export default todo;
