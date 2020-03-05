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
import { editTodo } from '../../actions/todo';

export const EditTodo = ({ editTodo, history, todo }) => {
  const [formData, setFormData] = useState({
    name: todo.name,
    description: todo.description
  });

  const { name, description } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    editTodo(todo._id, formData);
    history.push('/dashboard');
  };

  return (
    <Card>
      <CardHeader tag="h4">Edit Todo</CardHeader>
      <CardBody>
        <Form onSubmit={e => onSubmit(e)}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              id="name"
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
              id="description"
              type="textarea"
              name="description"
              value={description}
              className="description"
              onChange={e => onChange(e)}
            ></Input>
          </FormGroup>
          <Button color="primary">Edit Todo</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

EditTodo.propTypes = {
  editTodo: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  todo: state.todo.todo;
};

export default connect(mapStateToProps, { editTodo })(withRouter(EditTodo));
