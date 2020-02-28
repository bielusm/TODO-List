import React from 'react';
import { mockTodos } from '../../mocks/todos';
import { render, screen } from '@testing-library/react';
import { Todos } from '../../../src/components/todo/Todos';
import Todo from '../../../src/components/todo/Todo';

jest.mock('../../../src/components/todo/Todo');

describe('test todos component', () => {
  const getAllTodos = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getAllTodos fn', () => {
    render(<Todos todos={mockTodos} getAllTodos={getAllTodos} />);
    expect(getAllTodos).toHaveBeenCalledTimes(1);
  });

  it('should render mock todos', () => {
    render(<Todos todos={mockTodos} getAllTodos={getAllTodos} />);
    mockTodos.forEach(todo => {
      expect(screen.getByText(todo.name)).toBeInTheDocument();
      expect(Todo).toHaveBeenCalledWith({ todo }, {});
    });
  });

  it('should render warning when no todos', () => {
    render(<Todos todos={[]} getAllTodos={getAllTodos} />);
    expect(
      screen.getByText("You don't have any todos yet")
    ).toBeInTheDocument();
  });
});
