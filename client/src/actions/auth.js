import axios from 'axios';
import store from '../store';
const { dispatch } = store;
import { setAlert } from './alert';

let num = 0;

export const login = async ({ formData }) => {
  try {
    const res = await axios.get('/api/user/login', { ...formData });
  } catch (error) {
    setAlert('my bad alert', 'danger');
    console.error(error);
  }
};
