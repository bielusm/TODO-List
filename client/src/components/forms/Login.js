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
import { login } from '../../actions/auth';

const Login = props => {
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

  return (
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
          <Button color="primary">Submit</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Login;
