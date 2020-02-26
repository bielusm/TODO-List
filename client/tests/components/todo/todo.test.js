import React from 'react';
import { render, screen } from '@testing-library/react';
import Todo from '../../../src/components/todo/Todo';
import { mockTodos } from '../../mocks/todos';
import { Table } from 'reactstrap';
import Moment from 'moment';
const todo = mockTodos[0];

describe('todo component tests', () => {
  it('should render the todo', () => {
    render(
      <Table>
        <tbody>
          <Todo todo={todo} />
        </tbody>
      </Table>
    );
    const textDate = Moment(todo.date).format('YYYY/MM/DD');
    expect(screen.queryByText(todo.name)).toBeInTheDocument();
    expect(screen.queryByText(textDate)).toBeInTheDocument();
  });
});
