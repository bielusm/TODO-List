import React from 'react';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';

const HomePage = ({ history }) => {
  return (
    <Card className="mx-auto w-25">
      <CardHeader tag="h4">Welcome to the TODO List</CardHeader>
      <CardBody>
        <div>
          <Button
            color="primary"
            className="d-block mx-auto my-2"
            onClick={() => {
              history.push('/register');
            }}
          >
            Register
          </Button>
          <Button
            color="primary"
            className="d-block mx-auto my-2"
            onClick={() => {
              history.push('/login');
            }}
          >
            Login
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default HomePage;
