import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Card,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CardHeader,
  CardBody
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';

const Login = ({ authenticated, login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    login(formData);
  };

  if (authenticated) return <Redirect to="/dashboard" />;

  return (
    <Card>
      <CardHeader tag="h4" className="notepadTop">
        Login
      </CardHeader>
      <CardBody className="notepadBottom">
        <Form onSubmit={e => onSubmit(e)}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              value={email}
              required
              onChange={e => onChange(e)}
              className="notepadInput"
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              value={password}
              required
              onChange={e => onChange(e)}
              className="notepadInput"
            ></Input>
          </FormGroup>
          <Button color="primary" className="notepadBtn">
            Submit
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

Login.propTypes = {
  login: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, { login })(Login);
