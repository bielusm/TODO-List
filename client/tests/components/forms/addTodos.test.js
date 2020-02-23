import React from 'react';
import { shallow } from 'enzyme';
import { AddTodo } from '../../../src/components/forms/AddTodo';
import { Form } from 'reactstrap';

describe('Todo tests', () => {
  let addTodo = jest.fn();
  const formData = { name: 'todo name', description: 'todo description' };
  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<AddTodo addTodo={addTodo} />);
  });

  test('snapshot test', () => {
    expect(wrapper).toMatchSnapshot();
  });
  test('form submit', () => {
    const nameInput = wrapper.find('.name');
    nameInput.simulate('change', {
      target: { name: 'name', value: formData.name }
    });

    const descInput = wrapper.find('.description');
    descInput.value = formData.description;
    descInput.simulate('change', {
      target: {
        name: 'description',
        value: formData.description
      }
    });

    wrapper.find(Form).simulate('submit', { preventDefault: () => {} });
    expect(addTodo).toHaveBeenCalledWith(formData);
  });
});
