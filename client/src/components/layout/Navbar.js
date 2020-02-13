import AppBar from '@material-ui/core/Appbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import React from 'react';

export const Navbar = () => {
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1
    },
    title: {
      flexGrow: 1
    }
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Todo List
          </Typography>
          <Button color="inherit">Register</Button>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
