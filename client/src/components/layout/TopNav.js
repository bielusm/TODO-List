import React from 'react';
import { Navbar, NavbarBrand, NavItem, NavLink, Nav, Button } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';

export const TopNav = props => {
  return (
    <>
      <Navbar color="light">
        <NavbarBrand>TODO List</NavbarBrand>
        <Nav>
          <NavItem>
            <NavLink tag={Link} to="/dashboard">
              Dashboard
            </NavLink>
          </NavItem>
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
        </Nav>
      </Navbar>
    </>
  );
};

export default withRouter(TopNav);
