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
    this.beforeAll(async function() {
      this.timeout(5000);
      try {
        await mongoose.connect(config.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        const res = await chai
          .request(server)
          .post('/api/users')
          .send(testUser);
        token = res.body.token;
      } catch (error) {
        console.error(error);
      }
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
      console.log(res);
      expect(res.text).to.equal('Todo added');
    });
  });
});
