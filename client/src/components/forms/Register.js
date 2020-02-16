import PropTypes from 'prop-types';
import React, { useState } from 'react';
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
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import { connect } from 'react-redux';

const Register = ({ register, setAlert }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: ''
  });

  const { email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (password === password2) register(formData);
    else setAlert('Passwords must match', 'danger');
  };

  return (
    <>
      <Card>
        <CardHeader tag="h4">Login</CardHeader>
        <CardBody>
          <Form onSubmit={e => onSubmit(e)}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={e => onChange(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={e => onChange(e)}
              ></Input>
            </FormGroup>
            <FormGroup>
              <Label for="password2">Confirm Password</Label>
              <Input
                type="password"
                name="password2"
                value={password2}
                onChange={e => onChange(e)}
              ></Input>
            </FormGroup>
            <Button color="primary">Submit</Button>
          </Form>
        </CardBody>
      </Card>
    </>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { register, setAlert })(Register);
