'use strict';

const express = require('express');
const User = require('./config/user/User');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

app.post('/api/1.0/users', (req, resp) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = Object.assign({}, req.body, { password: hash });

      return User.create(user);
    })
    .then(() => {
      return resp.status(200).send({ message: 'User created' });
    });
});

module.exports = app;
