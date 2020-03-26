import {
  SET_TODOS,
  REMOVE_TODO,
  REMOVE_TODO_BY_ID,
  SET_TODO,
  EDIT_TODO,
  ADD_TODO
} from '../actions/types';

export const initialState = {
  todos: [],
  todo: null
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
        todo: null
      };

    case REMOVE_TODO_BY_ID:
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== payload)
      };

    case EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo._id !== action.id) return todo;
          return { ...todo, ...payload };
        })
      };

    case SET_TODO:
      return {
        ...state,
        todo: payload
      };

    case ADD_TODO:
      return {
        ...state,
        todos: [payload, ...state.todos]
      };
    default:
      return state;
  }
};

export default todo;
