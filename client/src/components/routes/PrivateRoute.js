//code adapted from https://www.youtube.com/watch?v=ojYbcon588A
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

export const PrivateRoute = ({ component: Component, token, ...rest }) => {
  return <Route {...rest} render={props =>
    token ? <Component {...props} /> : <Redirect to="/login" />
  } />
};
const mapStateToProps = state => ({
  token: state.user.token
});

export default connect(mapStateToProps)(PrivateRoute);
