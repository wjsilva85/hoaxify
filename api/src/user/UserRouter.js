'use strict';

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateUser } = require('./UserMiddleware');

const UserService = require('./UserService');

router.post(
  '/api/1.0/users',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', 'Password cannot be null').notEmpty().isLength({ min: 6 }),
  ],
  validateUser,
  UserService.save
);

module.exports = router; // Export the router so that it can be used in api/index.js
