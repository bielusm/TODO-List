import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddTodo } from '../../../src/components/forms/AddTodo';

describe('AddTodo tests', () => {
  let addTodo = jest.fn();
  let history = { push: jest.fn() };
  const formData = { name: 'todo name', description: 'todo description' };
  beforeAll(() => {
    render(<AddTodo addTodo={addTodo} history={history} />);
  });

  test('form submit', () => {
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

    const submitBtn = screen.getAllByText('Add Todo')[1];
    fireEvent.click(submitBtn, { preventDefault: () => {} });
    expect(addTodo).toHaveBeenCalledWith(formData);
    expect(history.push).toHaveBeenCalled();
  });
});
