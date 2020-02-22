process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

const User = require('../models/User');
const Todo = require('../models/Todo');

const server = require('../server');
const request = require('supertest');

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
  });
  afterAll(async function() {
    await mongoose.connection.close();
    await User.deleteMany({});
    await Todo.deleteMany({});
  });

  describe('POST api/todo', () => {
    it('Should create a todo', async () => {
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
    });
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
});
