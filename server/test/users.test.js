process.env.NODE_ENV = 'test';

const config = require('config');

const mongoose = require('mongoose');
const User = require('../models/User');
let server = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const request = require('supertest');

chai.use(chaiHttp);

const testUser = { email: 'test@test.com', password: 'password' };

describe('Users', () => {
  beforeAll(async function() {
    await mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async function() {
    await mongoose.connection.close();
    await User.deleteMany({});
  });

  describe('POST api/users', () => {
    test('Should register user', async () => {
      expect(await User.countDocuments()).to.equal(0);
      const res = await request(server)
        .post('/api/users')
        .send(testUser);
      expect(res).to.have.status(200).to.be.json;
      expect(res.body.token).to.exist;
      expect(await User.countDocuments()).to.equal(1);
      user = await User.findOne({ email: testUser.email });
      expect(user);
      expect(user.email).to.equal(testUser.email);
      expect(user.hash).to.exist;
    });

    test('Should not allow duplicate user', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);
      res = await request(server)
        .post('/api/users')
        .send(testUser);

      expect(res).to.have.status(400).to.be.json;
      const errors = res.body.errors;
      expect(errors).to.be.a.lengthOf(1);
      expect(errors[0].msg).to.equal('User already exists');
    });

    test('Should not allow bad input', async () => {
      let res = await request(server).post('/api/users');
      expect(res).to.have.status(400).to.be.json;
      let errors = res.body.errors;

      expect(errors).to.be.a.lengthOf(2);
      expect(errors[0].msg).to.equal('email is required');
      expect(errors[1].msg).to.equal('password is required');

      res = await request(server)
        .post('/api/users')
        .send({
          email: 'aa',
          password: ''
        });
      expect(res).to.have.status(400).to.be.json;
      errors = res.body.errors;
      expect(errors).to.be.a.lengthOf(2);
      expect(errors[0].msg).to.equal('email is required');
      expect(errors[1].msg).to.equal('password is required');
    });
  });

  describe('/api/login', () => {
    test('Should login user', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);

      res = await request(server)
        .post('/api/users/login')
        .send(testUser);

      expect(res).to.have.status(200).to.be.json;
      expect(res.body.token).to.exist;
    });

    test('Should not allow wrong password', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);

      res = await request(server)
        .post('/api/users/login')
        .send({ email: testUser.email, password: '123' });

      expect(res).to.have.status(401).to.be.json;
      errors = res.body.errors;
      expect(errors).to.be.a.lengthOf(1);
      expect(errors[0].msg).to.equal('Username or password is incorrect');
    });

    test('Should not allow invalid email', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);

      res = await request(server)
        .post('/api/users/login')
        .send({ email: 'fakeemail@fake.com', password: '123' });

      expect(res).to.have.status(400).to.be.json;
      errors = res.body.errors;
      expect(errors).to.be.a.lengthOf(1);
      expect(errors[0].msg).to.equal('User does not exist');
    });

    test('Should not allow invalid body', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);

      res = await request(server)
        .post('/api/users/login')
        .send({ email: null, password: false });

      expect(res).to.have.status(400).to.be.json;
      let errors = res.body.errors;
      expect(errors).to.be.a.lengthOf(2);
      expect(errors[0].msg).to.equal('email is required');
      expect(errors[1].msg).to.equal('password is required');
    });
  });
});
