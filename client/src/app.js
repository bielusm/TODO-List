import React from 'react';
import ReactDOM from 'react-dom';

import configureStore from './store';
import { Provider } from 'react-redux';

import TopNav from './components/layout/TopNav';
import Login from './components/forms/Login';
import Register from './components/forms/Register';
import Alerts from './components/layout/Alerts';
import Dashboard from './components/layout/Dashboard';
import PrivateRoute from './components/routes/PrivateRoute';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.css';

const store = configureStore;

const jsx = (
  <Provider store={store}>
    <Router>
      <TopNav />
      <Container className="pt-2">
        <Alerts />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Container>
    </Router>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('app'));
