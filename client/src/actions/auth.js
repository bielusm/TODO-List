import axios from 'axios';
import { setAlert } from './alert';

export const login = data => async dispatch => {
  try {
    const body = JSON.stringify(data);
    const config = { headers: { 'content-type': 'application/json' } };
    const res = await axios.post('/api/users/login', body, config);
    return res.data;
  } catch (error) {
    if (error.response) {
      error.response.data.errors.forEach(error => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    } else console.error(error);
  }
};

export const register = data => async dispatch => {
  try {
    const body = JSON.stringify(data);
    const config = { headers: { 'content-type': 'application/json' } };
    const res = await axios.post('/api/users', body, config);
    return res.data;
  } catch (error) {
    if (error.response) {
      error.response.data.errors.forEach(error => {
        dispatch(setAlert(error.msg, 'danger'));
      });
    } else console.error(error);
  }
};
