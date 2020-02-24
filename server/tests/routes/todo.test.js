process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

const User = require('../../models/User');
const Todo = require('../../models/Todo');

const server = require('../../app');
const request = require('supertest');

const Moment = require('moment');

const testTodos = [
  { name: 'Get gas', description: 'go to gas station' },
  { name: 'Ride bike', description: '' },
  { name: 'Get groceries' },
  { name: 'Study for exam', description: 'must study for exam' }
];
const testUser = { email: 'test@test.com', password: 'password' };
let token = '';

describe('Todos', () => {
  beforeAll(async () => {
    await mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
    await User.deleteMany({});
    const res = await request(server)
      .post('/api/users')
      .send(testUser);
    token = res.body.token;

    const user = await User.findOne({ email: testUser.email });
    const id = user._id;

    testTodos.forEach(t => {
      const todo = new Todo({ ...t, User: id, date: Moment() });
      todo.save();
      user.todos = [...user.todos, todo._id];
    });
    await user.save();
  });
  afterAll(async function() {
    await mongoose.connection.close();
    await User.deleteMany({});
  });

  describe('POST api/todo', () => {
    test('Should create a todo', async () => {
      const res = await request(server)
        .post('/api/todo')
        .set('x-auth-token', token)
        .send({ name: 'test', description: 'test description' })
        .expect(200);
      expect(res.text).toEqual('Todo added');

      const todo = await Todo.findOne({ name: 'test' });
      expect(todo);
      expect(todo.name).toEqual('test');
      expect(todo.description).toEqual('test description');
      Todo.findOneAndRemove(todo);
    });
    test('Should not allow invalid JWT token', async () => {
      //No token
      let res = await request(server)
        .post('/api/todo')
        .send({ name: 'test', description: 'test description' })
        .expect(400);
      let errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('No Token In Header');

      res = await request(server)
        .post('/api/todo')
        .set('x-auth-token', 'adhwdawdad')
        .send({ name: 'test', description: 'test description' })
        .expect(401);
      errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('Not authorized');
    });

    test('Should not allow no name', async () => {
      let res = await request(server)
        .post('/api/todo')
        .set('x-auth-token', token)
        .expect(400);
      const errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('name is required');
    });
  });
  describe('GET api/todo', () => {
    test('should get all todos', async () => {
      const res = await request(server)
        .get('/api/todo')
        .set('x-auth-token', token)
        .expect(200);

      const todos = res.body.todos;
      todos.forEach(todo => {
        expect(todo).toMatchSnapshot(
          {
            User: expect.any(String),
            __v: expect.any(Number),
            _id: expect.any(String),
            date: expect.anything()
          },
          'Get all todos returns correct todos'
        );
      });
    });
    test('Should not allow invalid JWT token', async () => {
      //No token
      let res = await request(server)
        .get('/api/todo')
        .send({ name: 'test', description: 'test description' })
        .expect(400);
      let errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('No Token In Header');
      //Invalid token
      res = await request(server)
        .get('/api/todo')
        .set('x-auth-token', 'adhwdawdad')
        .send({ name: 'test', description: 'test description' })
        .expect(401);
      errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('Not authorized');
    });
  });
});
