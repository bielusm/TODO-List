import React from 'react';
import Moment from 'react-moment';
import { Button } from 'reactstrap';

const Todo = () => {
  return (
    <tr>
      <td>Buy Groceries</td>
      <td>
        <Button color="link">
          <i className="fas fa-check fa-lg"></i>
        </Button>
      </td>
      <td>
        <Moment format="YYYY/MM/DD">1976-04-19T12:59-0500</Moment>
      </td>
    </tr>
  );
};

export default Todo;
