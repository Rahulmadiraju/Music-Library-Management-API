// src/middleware/validation.js
const { body, param, query } = require('express-validator');

// Validation rules for different endpoints

const signupValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').exists().withMessage('Password is required')
];

const userValidation = [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['editor', 'viewer']).withMessage('Role must be either editor or viewer')
];

const paginationValidation = [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be a number between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive number')
];

const idValidation = [
  param('id').isUUID().withMessage('Invalid ID format')
];

const artistValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('grammy').optional().isInt({ min: 0 }).withMessage('Grammy count must be a non-negative integer'),
  body('hidden').optional().isBoolean().withMessage('Hidden must be a boolean value')
];

const albumValidation = [
  body('artist_id').isUUID().withMessage('Invalid artist ID'),
  body('name').notEmpty().withMessage('Name is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Year must be a valid integer'),
  body('hidden').optional().isBoolean().withMessage('Hidden must be a boolean value')
];

const trackValidation = [
  body('artist_id').isUUID().withMessage('Invalid artist ID'),
  body('album_id').isUUID().withMessage('Invalid album ID'),
  body('name').notEmpty().withMessage('Name is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('hidden').optional().isBoolean().withMessage('Hidden must be a boolean value')
];

const favoriteValidation = [
  body('category').isIn(['artist', 'album', 'track']).withMessage('Category must be artist, album, or track'),
  body('item_id').isUUID().withMessage('Invalid item ID')
];

const categoryValidation = [
  param('category').isIn(['artist', 'album', 'track']).withMessage('Category must be artist, album, or track')
];

module.exports = {
  signupValidation,
  loginValidation,
  userValidation,
  paginationValidation,
  idValidation,
  artistValidation,
  albumValidation,
  trackValidation,
  favoriteValidation,
  categoryValidation
};
