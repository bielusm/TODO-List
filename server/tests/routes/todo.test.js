process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

const User = require('../../models/User');
const Todo = require('../../models/Todo');

const server = require('../../app');
const request = require('supertest');

const Moment = require('moment');

const { seedUser } = require('../fixtures/users');
let token = '';

const {
  seedDatabaseAndConnect,
  clearDatabaseAndDisconnect
} = require('../fixtures/seedDatabase');

describe('Todos', () => {
  beforeAll(async () => {
    await seedDatabaseAndConnect();
    //login test user
    res = await request(server)
      .post('/api/users/login')
      .send(seedUser);
    token = res.body.token;
  });
  afterAll(async function() {
    await clearDatabaseAndDisconnect();
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
