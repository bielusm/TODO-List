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

  it('should call getAllTodos fn when todos arent given', () => {
    render(<Todos getAllTodos={getAllTodos} todos={[]} loading={false} />);
    expect(getAllTodos).toHaveBeenCalledTimes(1);
  });

  it('should render mock todos', () => {
    render(
      <Todos todos={mockTodos} getAllTodos={getAllTodos} loading={false} />
    );
    mockTodos.forEach(todo => {
      expect(screen.getByText(todo.name)).toBeInTheDocument();
      expect(Todo).toHaveBeenCalledWith({ todo }, {});
    });
  });

  it('should render warning when no todos', () => {
    render(<Todos todos={[]} getAllTodos={getAllTodos} loading={false} />);
    expect(
      screen.getByText("You don't have any todos yet")
    ).toBeInTheDocument();
  });

  it('should not call getAllTodos if loading or there are todos', () => {
    render(<Todos todos={[]} getAllTodos={getAllTodos} loading={true} />);
    expect(getAllTodos).toHaveBeenCalledTimes(0);

    getAllTodos.mockReset();
    render(<Todos todos={[{ name: 'placeholder', description: 'placeholder' }]} getAllTodos={getAllTodos} loading={false} />);
    expect(getAllTodos).toHaveBeenCalledTimes(0);
  });
});
