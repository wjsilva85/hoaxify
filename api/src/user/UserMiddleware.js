'use strict';

const saveValidator = (req, resp, next) => {
  const { username, email, password } = req.body;

  if (!username) {
    return resp.status(400).send({ validationErrors: { username: 'Username is required' } });
  }

  if (!email) {
    return resp.status(400).send({ validationErrors: { email: 'Email is required' } });
  }

  if (!password) {
    return resp.status(400).send({ validationErrors: { password: 'Password is required' } });
  }

  next();
};

module.exports = {
  saveValidator,
};
