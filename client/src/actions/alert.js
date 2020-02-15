import store from '../store';
import { uuid } from 'uuidv4';
import { ADD_ALERT, REMOVE_ALERT } from '../actions/types';

const { dispatch } = store;

export const setAlert = (message, type) => {
  const id = uuid();
  const payload = { id, message, type };
  dispatch({ type: ADD_ALERT, payload });

  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, 5000);
};
