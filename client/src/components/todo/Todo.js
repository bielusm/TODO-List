import React from 'react';
import Moment from 'react-moment';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeTodoAction } from '../../actions/todo';

export const Todo = ({ todo: { name, date, _id }, removeTodoAction }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>
        <Moment format="YYYY/MM/DD">{date}</Moment>
      </td>
      <td>
        <Button color="link" onClick="">
          <i className="fas fa-edit fa-lg"></i>
        </Button>
      </td>
      <td>
        <Button color="link" onClick={e => removeTodoAction(_id)}>
          <i className="fas fa-check fa-lg"></i>
        </Button>
      </td>
    </tr>
  );
};

Todo.propTypes = {
  todo: PropTypes.object.isRequired,
  removeTodoAction: PropTypes.func.isRequired
};

export default connect(null, { removeTodoAction })(Todo);
