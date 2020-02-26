import React from 'react';
import Moment from 'react-moment';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const Todo = ({ todo: { name, date } }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>
        <Button color="link">
          <i className="fas fa-check fa-lg"></i>
        </Button>
      </td>
      <td>
        <Moment format="YYYY/MM/DD">{date}</Moment>
      </td>
    </tr>
  );
};

Todo.propTypes = {
  todo: PropTypes.object.isRequired
};

export default Todo;
