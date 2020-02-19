process.env.NODE_ENV = 'test';

const User = require('../models/User');
const server = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const testUser = { email: 'test@test.com', password: 'password' };

describe('Users', function() {
  beforeEach(async function() {
    await User.deleteMany();
  });

  describe('POST api/users', function() {
    it('Should register user', async function() {
      expect(await User.countDocuments()).to.equal(0);

      const res = await chai
        .request(server)
        .post('/api/users')
        .send(testUser);
      expect(res).to.have.status(200).to.be.json;
      expect(res.body.token).to.exist;

      expect(await User.countDocuments()).to.equal(1);
      user = await User.findOne({ email: testUser.email });
      expect(user.email).to.equal(testUser.email);
      expect(user.hash).to.exist;
    });

    it('Should not allow duplicate user', async function() {
      let res = await chai
        .request(server)
        .post('/api/users')
        .send(testUser);
      res = await chai
        .request(server)
        .post('/api/users')
        .send(testUser);

      expect(res).to.have.status(400).to.be.json;
      const errors = res.body.errors;
      expect(errors).to.be.a.lengthOf(1);
      expect(errors[0].msg).to.equal('User already exists');
    });
    it('Should not allow bad input', async function() {
      let res = await chai.request(server).post('/api/users');
      expect(res).to.have.status(400).to.be.json;
      let errors = res.body.errors;
      expect(errors).to.be.a.lengthOf(2);
      expect(errors[0].msg).to.equal('Email is invalid');
      expect(errors[1].msg).to.equal('Password is required');

      res = await chai
        .request(server)
        .post('/api/users')
        .send({
          email: 'aa',
          password: ''
        });
      expect(res).to.have.status(400).to.be.json;
      errors = res.body.errors;
      expect(errors).to.be.a.lengthOf(2);
      expect(errors[0].msg).to.equal('Email is invalid');
      expect(errors[1].msg).to.equal('Password is required');
    });
  });
});
