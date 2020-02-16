import axios from 'axios';
import store from '../store';
import { setAlert } from './alert';

export const login = data => async dispatch => {
  try {
    const body = JSON.stringify(data);
    const config = { headers: { 'content-type': 'application/json' } };
    const res = await axios.post('/api/users/login', body, config);
  } catch (error) {
    error.response.data.errors.forEach(error => {
      setAlert(error.msg, 'danger');
    });
  }
};
