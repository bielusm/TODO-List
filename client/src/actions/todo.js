import { setAlert } from './alert';
import axios from 'axios';

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
