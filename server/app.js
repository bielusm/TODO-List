const express = require('express');
const app = express();

//Init Middleware
//Body parser
app.use(express.json());

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/todo', require('./routes/todo'));

module.exports = app;
