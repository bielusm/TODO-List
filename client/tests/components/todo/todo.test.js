import React from 'react';
import { render, screen } from '@testing-library/react';
import { Todo } from '../../../src/components/todo/Todo';
import { mockTodos } from '../../mocks/todos';
import { Table } from 'reactstrap';
import Moment from 'moment';
import { MemoryRouter } from 'react-router-dom';
const todo = mockTodos[0];

describe('todo component tests', () => {
  const removeTodoAction = jest.fn();
  beforeAll(() => {
    jest.clearAllMocks();
    render(
      <MemoryRouter>
        <Table>
          <tbody>
            <Todo todo={todo} removeTodoAction={removeTodoAction} />
          </tbody>
        </Table>
      </MemoryRouter>
    );
  });

  it('should render the todo', () => {
    const textDate = Moment(todo.date).format('YYYY/MM/DD');
    expect(screen.queryByText(todo.name)).toBeInTheDocument();
    expect(screen.queryByText(textDate)).toBeInTheDocument();
  });
  it('should call delete method with id', () => {});
});
