'use strict';

const User = require('./User');
const bcrypt = require('bcrypt');

const save = (req, resp) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = Object.assign({}, req.body, { password: hash });

      return User.create(user);
    })
    .then(() => {
      return resp.status(200).send({ message: 'User created' });
    })
    .catch((err) => {
      return resp.status(500).send({ message: err.message || err });
    });
};

module.exports = {
  save,
};
