// src/utils/validators.js
const { body, param, query } = require('express-validator');

const signupValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

const userValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['editor', 'viewer'])
];

const paginationValidation = [
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
];

const idValidation = [
  param('id').isUUID()
];

module.exports = {
  signupValidation,
  loginValidation,
  userValidation,
  paginationValidation,
  idValidation
};