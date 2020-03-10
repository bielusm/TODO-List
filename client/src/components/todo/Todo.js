import React from 'react';
import Moment from 'react-moment';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeTodoByIdAction } from '../../actions/todo';
import { Link } from 'react-router-dom';

export const Todo = ({ todo: { name, date, _id }, removeTodoByIdAction }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>
        <Moment format="YYYY/MM/DD">{date}</Moment>
      </td>
      <td>
        <Link to={`/edit-todo/${_id}`}>
          <Button>
            <i className="fas fa-edit fa-lg"></i>
          </Button>
        </Link>
      </td>
      <td>
        <Button color="link" onClick={e => removeTodoByIdAction(_id)}>
          <i className="fas fa-check fa-lg"></i>
        </Button>
      </td>
    </tr>
  );
};

Todo.propTypes = {
  todo: PropTypes.object.isRequired,
  removeTodoByIdAction: PropTypes.func.isRequired
};

export default connect(null, { removeTodoByIdAction })(Todo);
