const express = require('express');
const app = express();

app.use(express.static('../client/docs/'));

//Init Middleware
//Body parser
app.use(express.json());

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/todo', require('./routes/todo'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

module.exports = app;
