if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

//Init Middleware
//Body parser
app.use(express.json());

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/todo', require('./routes/todo'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
