'use strict';

const express = require('express');
const router = express.Router();
const UserMiddleware = require('./UserMiddleware');

const UserService = require('./UserService');

router.post('/api/1.0/users', UserMiddleware.saveValidator, UserService.save);

module.exports = router; // Export the router so that it can be used in api/index.js
