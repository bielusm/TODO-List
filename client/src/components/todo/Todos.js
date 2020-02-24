import React from 'react';
import Todo from './Todo';
import { Table } from 'reactstrap';

const Todos = () => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Finished</th>
          <th>Added</th>
        </tr>
      </thead>
      <tbody>
        <Todo />
        <Todo />
      </tbody>
    </Table>
  );
};

export default Todos;
