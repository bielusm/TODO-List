import { setAlert } from './alert';
import axios from 'axios';
import { SET_TODOS, REMOVE_TODO, SET_TODO, REMOVE_TODO_BY_ID } from './types';

export const removeTodo = () => ({
  type: REMOVE_TODO
});

export const editTodo = formData => {
  console.log('place holder');
};

export const setTodo = todo => ({
  type: SET_TODO,
  payload: todo
});

export const setTodoAction = id => async (dispatch, getState) => {
  try {
    const config = {
      headers: {
        'x-auth-token': getState().user.token
      }
    };

    const res = await axios.get(`/api/todo/${id}`, config);
    dispatch(setTodo(res.data));
  } catch (error) {
    if (error.response) {
      error.response.data.errors.forEach(error => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    } else console.error(error);
  }
};

export const removeTodoById = id => ({
  type: REMOVE_TODO_BY_ID,
  payload: id
});

export const removeTodoByIdAction = id => async (dispatch, getState) => {
  const config = {
    headers: {
      'x-auth-token': getState().user.token
    }
  };

  try {
    const res = await axios.delete(`/api/todo/${id}`, config);
    dispatch(setAlert('Todo removed', 'success'));
    dispatch(removeTodoById(id));
  } catch (error) {
    if (error.response) {
      error.response.data.errors.forEach(error => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    } else console.error(error);
  }
};

export const addTodo = formData => async (dispatch, getState) => {
  try {
    const body = JSON.stringify(formData);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': getState().user.token
      }
    };

    const res = await axios.post('/api/todo', body, config);
    dispatch(setAlert('Todo added', 'success'));
  } catch (error) {
    if (error.response) {
      error.response.data.errors.forEach(error => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    } else console.error(error);
  }
};

export const addTodos = todos => {
  return {
    type: SET_TODOS,
    payload: todos
  };
};

export const getAllTodos = () => async (dispatch, getState) => {
  try {
    const config = {
      headers: {
        'x-auth-token': getState().user.token
      }
    };

    const res = await axios.get('/api/todo', config);
    dispatch(addTodos(res.data));
  } catch (error) {
    if (error.response) {
      error.response.data.errors.forEach(error => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    } else console.error(error);
  }
};
