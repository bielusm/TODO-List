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

const AddTodo = ({ authenticated, AddTodo }) => {
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
    AddTodo(formData);
  };

  return (
    <Card>
      <CardHeader tag="h4">AddTodo</CardHeader>
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
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              value={description}
              onChange={e => onChange(e)}
            ></Input>
          </FormGroup>
          <Button color="primary">Add Todo</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

AddTodo.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, {})(AddTodo);
