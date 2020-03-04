process.env.NODE_ENV = 'test';

const Todo = require('../../models/Todo');
const ObjectId = require('mongoose').Types.ObjectId;

const server = require('../../app');
const request = require('supertest');

const { seedUser } = require('../fixtures/users');
let token = '';

const {
  seedDatabaseAndConnect,
  clearDatabaseAndDisconnect
} = require('../fixtures/seedDatabase');

const dummyTodo = { name: 'test', description: 'test description' };
const createTodo = async () => {
  return (res = await request(server)
    .post('/api/todo')
    .set('x-auth-token', token)
    .send(dummyTodo)
    .expect(200));
};

const testInvalidToken = async url => {
  //No token
  let res = await request(server)
    .post(url)
    .send(dummyTodo)
    .expect(400);
  let errors = res.body.errors;
  expect(errors.length).toEqual(1);
  expect(errors[0].msg).toEqual('No Token In Header');

  res = await request(server)
    .post(url)
    .set('x-auth-token', 'adhwdawdad')
    .send(dummyTodo)
    .expect(401);
  errors = res.body.errors;
  expect(errors.length).toEqual(1);
  expect(errors[0].msg).toEqual('Not authorized');
};

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
    it('Should create a todo', async () => {
      const res = await createTodo();
      let todo = await Todo.findOne(dummyTodo);
      expect(res.body).toMatchSnapshot({
        User: expect.any(String),
        _id: expect.any(String),
        date: expect.anything()
      });

      expect(todo);
      expect(todo.name).toEqual(dummyTodo.name);
      expect(todo.description).toEqual(dummyTodo.description);
      Todo.findOneAndRemove(todo);
    });
    it('Should not allow invalid JWT token', async () => {
      await testInvalidToken('/api/todo');
    });

    it('Should not allow no name', async () => {
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
    it('should get all todos', async () => {
      const res = await request(server)
        .get('/api/todo')
        .set('x-auth-token', token)
        .expect(200);

      const todos = res.body;
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
    it('Should not allow invalid JWT token', async () => {
      await testInvalidToken('/api/todo');
    });
  });

  describe('delete API/todo/id', () => {
    it('should delete a todo', async () => {
      let res = await createTodo();
      const id = res.body._id;
      const todosInDb = await Todo.countDocuments();

      res = await request(server)
        .delete(`/api/todo/${id}`)
        .set('x-auth-token', token)
        .expect(200);

      expect(res.text).toEqual('Todo removed');

      expect(await Todo.exists({ id })).toBeFalsy();
      expect(await Todo.countDocuments()).toEqual(todosInDb - 1);
    });
    it('should not allow invalid JWT token', async () => {
      let res = await createTodo();
      const id = res.body._id;

      res = await request(server)
        .delete(`/api/todo/${id}`)
        .expect(400);
      let errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('No Token In Header');

      res = await request(server)
        .delete(`/api/todo/${id}`)
        .set('x-auth-token', 'adhwdawdad')
        .expect(401);
      errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('Not authorized');

      await Todo.findOneAndRemove(id);
    });

    it('should not allow an invalid todo ID', async () => {
      const res = await request(server)
        .delete(`/api/todo/${new ObjectId('123456789012')}`)
        .set('x-auth-token', token)
        .expect(400);

      expect(res.body.errors[0].msg).toEqual('Invalid Todo ID');
    });

    it('should not allow the wrong user to delete a todo', async () => {
      let res = await createTodo();
      const todoId = res.body._id;

      res = await request(server)
        .post('/api/users')
        .send({ email: 'bob@gmail.com', password: 'password' });
      const newToken = res.body.token;

      res = await request(server)
        .delete(`/api/todo/${todoId}`)
        .set('x-auth-token', newToken)
        .expect(401);

      expect(res.body.errors[0].msg).toEqual('Not authorized');
    });
  });
});
