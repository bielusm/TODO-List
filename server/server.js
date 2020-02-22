const config = require('config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');

//Init Middleware
//Body parser
app.use(express.json());

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/todo', require('./routes/todo'));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

  mongoose
    .connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Mongo connected'))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = app;
