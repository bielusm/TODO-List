import React from 'react';
import Moment from 'react-moment';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeTodo } from '../../actions/todo';

export const Todo = ({ todo: { name, date, _id }, removeTodo }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>
        <Moment format="YYYY/MM/DD">{date}</Moment>
      </td>
      <td>
        <Button color="link" onClick={e => removeTodo(_id)}>
          <i className="fas fa-check fa-lg"></i>
        </Button>
      </td>
      <td>
        <Button color="link" onClick={e => removeTodo(_id)}>
          <i className="fas fa-trash-alt fa-lg"></i>
        </Button>
      </td>
    </tr>
  );
};

Todo.propTypes = {
  todo: PropTypes.object.isRequired
};

export default connect(null, { removeTodo })(Todo);
