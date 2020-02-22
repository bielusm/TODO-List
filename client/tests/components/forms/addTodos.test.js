import React from 'react';
import { shallow } from 'enzyme';
import { AddTodo } from '../../../src/components/forms/AddTodo';
test('snapshot add todo form', () => {
  let wrapper = shallow(<AddTodo authenticated={true} />);
  expect(wrapper).toMatchSnapshot();

  wrapper = shallow(<AddTodo authenticated={false} />);
  expect(wrapper).toMatchSnapshot();
});
