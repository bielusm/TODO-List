import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavbarBrand, NavItem, NavLink, Nav, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

export const TopNav = ({ authenticated }) => {
  const authLinks = (
    <>
      <NavItem>
        <NavLink tag={Link} to="/dashboard">
          Dashboard
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/logout">Logout</NavLink>
      </NavItem>
    </>
  );

  const guestLinks = (
    <>
      <NavItem>
        <NavLink tag={Link} to="/register">
          Register
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} to="/login">
          Login
        </NavLink>
      </NavItem>
    </>
  );

  return (
    <Navbar color="light">
      <NavbarBrand>TODO List</NavbarBrand>
      <Nav>{authenticated ? authLinks : guestLinks}</Nav>
    </Navbar>
  );
};

TopNav.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(withRouter(TopNav));
