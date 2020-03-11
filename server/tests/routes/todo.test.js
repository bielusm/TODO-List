process.env.NODE_ENV = 'test';

const Todo = require('../../models/Todo');
const ObjectId = require('mongoose').Types.ObjectId;

const server = require('../../app');
const request = require('supertest');

const { seedUser } = require('../fixtures/users');
const { seedTodos } = require('../fixtures/todos');
let token = '';

const {
  seedDatabase,
  disconnect,
  connect
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
    await connect();
    await seedDatabase();
  });
  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await seedDatabase();
    //login test user
    res = await request(server)
      .post('/api/users/login')
      .send(seedUser);
    token = res.body.token;
  });

  describe('POST api/todo', () => {
    test('Should create a todo', async () => {
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

  describe('GET api/todos/todo_id', () => {
    it('should return the todo by its id', async done => {
      const todo = await Todo.findOne(seedTodos[0]);
      const res = await request(server)
        .get(`/api/todo/${todo._id}`)
        .set('Accept', 'application/json')
        .set('x-auth-token', token)
        .expect(200);

      expect(JSON.stringify(res.body)).toEqual(JSON.stringify(todo));
      done();
    });

    it('should not allow invalid JWT token', async () => {
      const todo = await Todo.findOne(seedTodos[0]);
      const id = todo._id;
      res = await request(server)
        .get(`/api/todo/${id}`)
        .expect(400);
      let errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('No Token In Header');

      res = await request(server)
        .get(`/api/todo/${id}`)
        .set('x-auth-token', 'adhwdawdad')
        .expect(401);
      errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('Not authorized');
    });

    it('should not allow an invalid todo ID', async () => {
      const res = await request(server)
        .get(`/api/todo/${new ObjectId('123456789012')}`)
        .set('x-auth-token', token)
        .expect(400);

      expect(res.body.errors[0].msg).toEqual('Invalid Todo ID');
    });

    it('should not allow the wrong user to delete a todo', async () => {
      const todo = await Todo.findOne(seedTodos[0]);
      const todoId = todo._id;
      res = await request(server)
        .post('/api/users')
        .send({ email: 'bob@gmail.com', password: 'password' });
      const newToken = res.body.token;

      res = await request(server)
        .get(`/api/todo/${todoId}`)
        .set('x-auth-token', newToken)
        .expect(401);

      expect(res.body.errors[0].msg).toEqual('Not authorized');
    });
  });

  describe('PUT api/todos/todoId', () => {
    it('should edit the todo', async () => {
      const edits = { name: 'new name', description: 'new description' };
      const todo = await Todo.findOne(seedTodos[0]);
      const todoId = todo._id;

      res = await request(server)
        .put(`/api/todo/${todoId}`)
        .set('x-auth-token', token)
        .send(edits)
        .expect(200);

      expect(res.body).toMatchObject({
        ...edits
      });
    });

    it('should not allow invalid JWT token', async () => {
      const edits = { name: 'new name', description: 'new description' };
      const todo = await Todo.findOne(seedTodos[0]);
      const id = todo._id;

      res = await request(server)
        .put(`/api/todo/${id}`)
        .send(edits)
        .expect(400);
      let errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('No Token In Header');

      res = await request(server)
        .put(`/api/todo/${id}`)
        .set('x-auth-token', 'adhwdawdad')
        .send(edits)
        .expect(401);
      errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('Not authorized');
    });

    it('should not allow invalid todo ID', async () => {
      const edits = { name: 'new name', description: 'new description' };
      const res = await request(server)
        .put(`/api/todo/${new ObjectId('123456789012')}`)
        .set('x-auth-token', token)
        .send(edits)
        .expect(400);

      expect(res.body.errors[0].msg).toEqual('Invalid Todo ID');
    });

    it('should not allow the wrong user to edit todo', async () => {
      const todo = await Todo.findOne(seedTodos[0]);
      const todoId = todo._id;
      res = await request(server)
        .post('/api/users')
        .send({ email: 'bob@gmail.com', password: 'password' });
      const newToken = res.body.token;

      const edits = { name: 'new name', description: 'new description' };
      res = await request(server)
        .put(`/api/todo/${todoId}`)
        .set('x-auth-token', newToken)
        .send(edits)
        .expect(401);

      expect(res.body.errors[0].msg).toEqual('Not authorized');
    });
  });
});
