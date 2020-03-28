import React from 'react';
import { Card, CardHeader, CardBody, Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';

const HomePage = ({ history }) => {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: '0',
          top: '0',
          width: '100%',
          height: '100%',
          backgroundImage:
            "url('./blank-business-composition-computer-373076.jpg')",
          filter: 'grayscale(100%)'
        }}
      ></div>
      <Card
        className="m-auto"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid black'
        }}
      >
        <CardHeader tag="h4" className="notepadTop">
          Welcome to the TODO List
        </CardHeader>
        <CardBody className="notepadBottom">
          <div className="mx-auto" style={{ width: '40%' }}>
            <Button
              block
              size="lg"
              className="d-block mx-auto my-2 notepadBtn"
              onClick={() => {
                history.push('/register');
              }}
            >
              Register
            </Button>
            <Button
              block
              size="lg"
              color="primary"
              className="d-block mx-auto my-2 notepadBtn"
              onClick={() => {
                history.push('/login');
              }}
            >
              Login
            </Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default HomePage;
