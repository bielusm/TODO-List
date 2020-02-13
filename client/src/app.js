import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './store';
import { Provider } from 'react-redux';

import Navbar from './components/layout/Navbar';

const store = configureStore;

const jsx = (
  <Provider store={store}>
    <Navbar />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
