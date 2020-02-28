import React from 'react';

const Todo = jest.fn(({ todo }) => (
  <tr className="Todo component">
    <td>{todo.name}</td>
  </tr>
));
export default Todo;
