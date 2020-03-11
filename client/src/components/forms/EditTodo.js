import React, { useState, useEffect } from 'react';
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
import { editTodoAction, setTodoAction, removeTodo } from '../../actions/todo';

export const EditTodo = ({
  removeTodo,
  setTodoAction,
  editTodoAction,
  history,
  todo,
  match
}) => {
  const [formData, setFormData] = useState({
    name: todo ? todo.name : '',
    description: todo ? todo.description : ''
  });

  useEffect(() => {
    removeTodo();

    setTodoAction(match.params.todoId);
  }, []);

  useEffect(() => {
    setFormData({
      name: todo ? todo.name : '',
      description: todo ? todo.description : ''
    });
  }, [todo]);

  const { name, description } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    editTodoAction(todo._id, formData);
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
  editTodoAction: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  todo: state.todo.todo
});

export default connect(mapStateToProps, {
  editTodoAction,
  setTodoAction,
  removeTodo
})(withRouter(EditTodo));
