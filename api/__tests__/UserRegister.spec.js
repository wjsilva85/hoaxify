const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/User');
const sequelize = require('../src/config/database');

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

const validUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword',
};

const postUser = (user = validUser) => {
  return request(app).post('/api/1.0/users').send(user);
};

describe('User Registration', () => {
  it('returns "200 Ok" when signup request is valid', (done) => {
    postUser().then((response) => {
      expect(response.status).toBe(200);
      done();
    });
  });

  it('returns success message when signup request is valid', (done) => {
    postUser().then((response) => {
      expect(response.body.message).toBe('User created');
      done();
    });
  });

  it('saves the user to database', (done) => {
    postUser().then(() => {
      // query user table
      User.findAll().then((userList) => {
        expect(userList.length).toBe(1);
        done();
      });
    });
  });

  it('saves the username and email to database', (done) => {
    postUser().then(() => {
      // query user table
      User.findAll().then((userList) => {
        const savedUser = userList[0];

        expect(savedUser.username).toBe('user1');
        expect(savedUser.email).toBe('user1@mail.com');
        done();
      });
    });
  });

  it('hashes the password in database', (done) => {
    postUser().then(() => {
      // query user table
      User.findAll().then((userList) => {
        const savedUser = userList[0];

        expect(savedUser.password).not.toBe('P4ssword');

        done();
      });
    });
  });

  it('returns 400 when username is null', () => {
    return request(app)
      .post('/api/1.0/users')
      .send(Object.assign({}, validUser, { username: null }))

      .then((response) => {
        expect(response.status).toBe(400);
      });
  });

  it('returns validationErrors field in response body when validation error occurs', () => {
    return request(app)
      .post('/api/1.0/users')
      .send({}) /**Invalid user */

      .then((response) => {
        expect(response.body.validationErrors).not.toBeUndefined();
      });
  });

  it('returns "Username is required" when username is null', () => {
    return request(app)
      .post('/api/1.0/users')
      .send(Object.assign({}, validUser, { username: null })) /**Invalid user */

      .then((response) => {
        expect(response.body.validationErrors.username).toBe('Username is required');
      });
  });
});
