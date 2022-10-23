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
    return postUser(Object.assign({}, validUser, { username: null })).then((response) => {
      expect(response.status).toBe(400);
    });
  });

  it('returns validationErrors field in response body when validation error occurs', () => {
    return postUser({}) /**Invalid user */
      .then((response) => {
        expect(response.body.validationErrors).not.toBeUndefined();
      });
  });

  it('returns error when both, email and username are missing', () => {
    return request(app)
      .post('/api/1.0/users')
      .send(Object.assign({}, validUser, { email: null, username: null })) /**Invalid user */

      .then((response) => {
        expect(Object.keys(response.body.validationErrors)).toEqual(['username', 'email']);
      });
  });

  it.each([
    ['username', 'Username is required'],
    ['email', 'Email is required'],
    ['password', 'Password cannot be null'],
  ])('When %s is null, %s is received', async (field, expectedMessage) => {
    validUser[field] = null;
    const response = await postUser(validUser);
    expect(response.body.validationErrors[field].msg).toBe(expectedMessage);
  });

  it.each`
    field         | expectedMessage
    ${'username'} | ${'Username is required'}
    ${'email'}    | ${'Email is required'}
    ${'password'} | ${'Password cannot be null'}
  `('When $field is null, $expectedMessage is received', async ({ field, expectedMessage }) => {
    validUser[field] = null;
    const response = await postUser(validUser);
    expect(response.body.validationErrors[field].msg).toBe(expectedMessage);
  });
});
