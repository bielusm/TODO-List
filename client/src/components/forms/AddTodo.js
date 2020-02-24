import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
import { addTodo } from '../../actions/todo';

export const AddTodo = ({ addTodo, history }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const { name, description } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    addTodo(formData);
    history.push('/dashboard');
  };

  return (
    <Card>
      <CardHeader tag="h4">Add Todo</CardHeader>
      <CardBody>
        <Form onSubmit={e => onSubmit(e)}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              required
              value={name}
              onChange={e => onChange(e)}
              className="name"
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              value={description}
              className="description"
              onChange={e => onChange(e)}
            ></Input>
          </FormGroup>
          <Button color="primary">Add Todo</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

AddTodo.propTypes = {
  addTodo: PropTypes.func.isRequired
};

export default connect(null, { addTodo })(withRouter(AddTodo));
