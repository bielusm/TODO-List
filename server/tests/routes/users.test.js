process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const User = require('../../models/User');
let server = require('../../app');
const request = require('supertest');
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
      expect(await User.countDocuments()).toEqual(0);
      const res = await request(server)
        .post('/api/users')
        .send(testUser)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(res.body.token);
      expect(await User.countDocuments()).toEqual(1);
      user = await User.findOne({ email: testUser.email });
      expect(user);
      expect(user.email).toEqual(testUser.email);
      expect(user.hash);
    });

    test('Should not allow duplicate user', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);
      res = await request(server)
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .expect('Content-Type', /json/);

      const errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('User already exists');
    });

    test('Should not allow bad input', async () => {
      let res = await request(server)
        .post('/api/users')
        .expect(400)
        .expect('Content-Type', /json/);
      let errors = res.body.errors;

      expect(errors.length).toEqual(2);
      expect(errors[0].msg).toEqual('email is required');
      expect(errors[1].msg).toEqual('password is required');

      res = await request(server)
        .post('/api/users')
        .send({
          email: 'aa',
          password: ''
        })
        .expect(400)
        .expect('Content-Type', /json/);

      errors = res.body.errors;
      expect(errors.length).toEqual(2);
      expect(errors[0].msg).toEqual('email is required');
      expect(errors[1].msg).toEqual('password is required');
    });
  });

  describe('/api/login', () => {
    test('Should login user', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);

      res = await request(server)
        .post('/api/users/login')
        .send(testUser)
        .expect(200)
        .expect('Content-Type', /json/);
      expect(res.body.token);
    });

    test('Should not allow wrong password', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);

      res = await request(server)
        .post('/api/users/login')
        .send({ email: testUser.email, password: '123' })
        .expect(401)
        .expect('Content-Type', /json/);

      errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('Username or password is incorrect');
    });

    test('Should not allow invalid email', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);

      res = await request(server)
        .post('/api/users/login')
        .send({ email: 'fakeemail@fake.com', password: '123' })
        .expect(400)
        .expect('Content-Type', /json/);

      errors = res.body.errors;
      expect(errors.length).toEqual(1);
      expect(errors[0].msg).toEqual('User does not exist');
    });

    test('Should not allow invalid body', async () => {
      let res = await request(server)
        .post('/api/users')
        .send(testUser);

      res = await request(server)
        .post('/api/users/login')
        .send({ email: null, password: false })
        .expect(400)
        .expect('Content-Type', /json/);

      let errors = res.body.errors;
      expect(errors.length).toEqual(2);
      expect(errors[0].msg).toEqual('email is required');
      expect(errors[1].msg).toEqual('password is required');
    });
  });
});
