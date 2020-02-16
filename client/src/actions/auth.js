import axios from 'axios';
import { setAlert } from './alert';

export const login = data => async dispatch => {
  try {
    const body = JSON.stringify(data);
    const config = { headers: { 'content-type': 'application/json' } };
    const res = await axios.post('/api/users/login', body, config);
    return res.status(200).res.json(res);
  } catch (error) {
    error.response.data.errors.forEach(error => {
      dispatch(setAlert(error.msg, 'danger'));
    });
  }
};

export const register = data => async dispatch => {
  try {
    const body = JSON.stringify(data);
    const config = { headers: { 'content-type': 'application/json' } };
    const res = await axios.post('/api/users', body, config);
    return res.status(200).res.json(res);
  } catch (error) {
    error.response.data.errors.forEach(error => {
      dispatch(setAlert(error.msg, 'danger'));
    });
  }
};
