import React, { useEffect } from 'react';
import Todo from './Todo';
import { Table } from 'reactstrap';
import { getAllTodos } from '../../actions/todo';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export const Todos = ({ getAllTodos, todos }) => {
  useEffect(() => {
    getAllTodos();
  }, [getAllTodos]);

  return todos.length === 0 ? (
    <h3>You don't have any todos yet</h3>
  ) : (
    <>
      <h3>My Todos</h3>
      <Table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Date</td>
            <td>Edit</td>
            <td>Remove</td>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo, index) => (
            <Todo todo={todo} key={index} />
          ))}
        </tbody>
      </Table>
    </>
  );
};

const mapStateToProps = state => ({
  todos: state.todo.todos
});

Todos.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  getAllTodos: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { getAllTodos })(Todos);
