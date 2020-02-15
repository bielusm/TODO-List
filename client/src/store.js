import alert from './reducers/alert';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, createStore, applyMiddleware } from 'redux';

const reducer = combineReducers({ alert });

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
