'use strict';

const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const { validateUser } = require('./UserMiddleware');

const UserService = require('./UserService');

router.post(
  '/api/1.0/users',

  [
    check('username')
      .notEmpty()
      .withMessage('Username is required')
      .bail()
      .isLength({
        min: 4,
        max: 32,
      })
      .withMessage('Username must be at least 4 characters and at max 32 characters long'),

    check('email')
      .notEmpty()
      .withMessage('Email is required')
      .bail()
      .isLength({ min: 8, max: 35 })
      .withMessage('Email must be at least 8 characters and at max 35 characters long')
      .bail()
      .isEmail()
      .withMessage("Email doesn't look valid")
      .bail(),

    check('password')
      .notEmpty()
      .withMessage('Password cannot be null')
      .bail()
      .isLength({ min: 8, max: 18 })
      .withMessage('Password must be at least 8 characters and at max 18 characters long')
      .bail()
      .matches(/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/)
      .withMessage(
        'Password must contain at least 2 uppercase, 2 lowercase, 2 numbers, 1 special character and at least 8 characters long'
      ),

    // ^                         Start anchor
    // (?=.*[A-Z].*[A-Z])        Ensure string has two uppercase letters.
    // (?=.*[!@#$&*])            Ensure string has one special case letter.
    // (?=.*[0-9].*[0-9])        Ensure string has two digits.
    // (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
    // .{8}                      Ensure string is of length 8.
    // $                         End anchor.
  ],

  validateUser,
  UserService.save
);

module.exports = router; // Export the router so that it can be used in api/index.js
