const config = require('config');
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
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
