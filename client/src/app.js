import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './store';
import { Provider } from 'react-redux';

import TopNav from './components/layout/TopNav';
import Login from './components/forms/Login';
import Register from './components/forms/Register';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';

const store = configureStore;

const jsx = (
  <Provider store={store}>
    <Router>
      <TopNav />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    </Router>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
