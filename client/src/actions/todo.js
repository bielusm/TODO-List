import { setAlert } from './alert';
import axios from 'axios';

export const addTodo = formData => async dispatch => {
  try {
    const body = JSON.stringify(formData);
    const config = { headers: { 'content-type': 'application/json' } };
    const res = await axios.post('/api/todo', body, config);
    dispatch(setAlert('Todo added', 'success'));
  } catch (error) {
    console.error(error);
  }
};
