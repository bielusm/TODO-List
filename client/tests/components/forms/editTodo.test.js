import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditTodo } from '../../../src/components/forms/EditTodo';
import { mockTodos } from '../../mocks/todos';

describe('Edit Todo tests', () => {
  let editTodo = jest.fn();
  let history = { push: jest.fn() };
  const formData = { name: 'todo name', description: 'todo description' };

  beforeEach(() => {
    render(
      <EditTodo editTodo={editTodo} history={history} todo={mockTodos[0]} />
    );
    jest.clearAllMocks();
  });

  it('should submit without change', () => {
    const submitBtn = screen.getAllByText('Edit Todo')[1];
    fireEvent.click(submitBtn, { preventDefault: () => {} });
    const expected = expect.objectContaining({
      name: mockTodos[0].name,
      description: mockTodos[0].description
    });
    expect(editTodo).toHaveBeenCalledWith(mockTodos[0]._id, expected);
    expect(history.push).toHaveBeenCalled();
  });

  it('should submit with change', () => {
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, {
      target: { name: 'name', value: formData.name }
    });

    const descInput = screen.getByLabelText('Description');
    fireEvent.change(descInput, {
      target: {
        name: 'description',
        value: formData.description
      }
    });

    const submitBtn = screen.getAllByText('Edit Todo')[1];
    fireEvent.click(submitBtn, { preventDefault: () => {} });
    const expected = expect.objectContaining({
      name: formData.name,
      description: formData.description
    });
    expect(editTodo).toHaveBeenCalledWith(mockTodos[0]._id, expected);
    expect(history.push).toHaveBeenCalled();
  });
});
