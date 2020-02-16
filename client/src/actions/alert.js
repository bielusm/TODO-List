import store from '../store';
import { uuid } from 'uuidv4';
import { ADD_ALERT, REMOVE_ALERT } from '../actions/types';

export const setAlert = (message, color) => async dispatch => {
  const id = uuid();
  const payload = { id, message, color };
  dispatch({ type: ADD_ALERT, payload });

  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, 5000);
};
