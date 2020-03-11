const mongoose = require('mongoose');
const server = require('../../app');
const { seedUser } = require('./users');
const { seedTodos } = require('./todos');
const User = require('../../models/User');
const Todo = require('../../models/Todo');
const request = require('supertest');
const Moment = require('moment');

const connectToDb = async () => {
  await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
};

const fillUsers = async () => {
  // Need to go through server for hashed password
  const res = await request(server)
    .post('/api/users')
    .send(seedUser);
};

const fillTodos = async () => {
  const user = await User.findOne({ email: seedUser.email });
  const id = user._id;

  seedTodos.forEach(t => {
    const todo = new Todo({ ...t, User: id, date: Moment() });
    todo.save();
    user.todos = [...user.todos, todo._id];
  });
  await user.save();
};

const seedDatabase = async () => {
  await clearDatabase();
  await fillUsers();
  await fillTodos();
};

const connect = async () => {
  await connectToDb();
};

const disconnect = async () => {
  await mongoose.connection.close();
};

const clearDatabase = async () => {
  await User.deleteMany({});
  await Todo.deleteMany({});
};

module.exports = {
  seedDatabase,
  connect,
  disconnect
};
