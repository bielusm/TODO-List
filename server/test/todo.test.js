process.env.NODE_ENV = 'test';

const config = require('config');

const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const server = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
const testUser = { email: 'test@test.com', password: 'password' };
let token = '';
describe('Todos', function() {
  describe('POST api/todo', function() {
    before(async function() {
      this.timeout(5000);
      try {
        const res = await chai
          .request(server)
          .post('/api/users')
          .send(testUser);
        token = res.body.token;
      } catch (error) {}
    });

    beforeEach(async function() {
      this.timeout(5000);
      await Todo.deleteMany({});
    });

    this.afterAll(async function() {
      this.timeout(5000);
      await Todo.deleteMany({});
    });

    it('Should create a todo', async function() {
      const res = await chai
        .request(server)
        .post('/api/todo')
        .set('x-auth-token', token)
        .send({ name: 'test', description: 'test description' });

      expect(res).to.have.status(200);
      expect(res.text).to.equal('Todo added');
    });
  });

  it('Should not allow invalid JWT token', async function() {
    //No token
    let res = await chai
      .request(server)
      .post('/api/todo')
      .send({ name: 'test', description: 'test description' });
    expect(res).to.have.status(400);
    let errors = res.body.errors;
    expect(errors).to.be.length(1);
    expect(errors[0].msg).to.equal('No Token In Header');

    res = await chai
      .request(server)
      .post('/api/todo')
      .set('x-auth-token', 'adhwdawdad')
      .send({ name: 'test', description: 'test description' });
    expect(res).to.have.status(401);
    errors = res.body.errors;
    expect(errors).to.be.length(1);
    expect(errors[0].msg).to.equal('Not authorized');
  });
});
