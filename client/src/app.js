import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './configureStore';
import { Provider } from 'react-redux';

const store = configureStore;

const jsx = (
  <Provider store={store}>
    <div>Test</div>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
