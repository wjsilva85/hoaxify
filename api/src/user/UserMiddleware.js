'use strict';

const { validationResult } = require('express-validator');

const validateUser = (req, resp, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).send({ validationErrors: errors.mapped() });
  }

  next();
};

module.exports = {
  validateUser,
};
