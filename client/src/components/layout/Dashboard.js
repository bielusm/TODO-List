import React from 'react';
import { Table, Input, Button } from 'reactstrap';
import Moment from 'react-moment';

const Dashboard = props => {
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
        <tr>
          <td>Get gas</td>
          <td>
            <Button color="link">
              <i className="fas fa-check fa-lg"></i>
            </Button>
          </td>
          <td>
            <Moment format="YYYY/MM/DD">1976-04-19T12:59-0500</Moment>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Dashboard;