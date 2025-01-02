// src/middleware/auth.js
const { verifyToken } = require('../config/jwt');
const { errorResponse } = require('../utils/responseHandler');
const { validationResult } = require('express-validator');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(errorResponse(401, 'Unauthorized Access'));
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(errorResponse(401, 'Unauthorized Access'));
  }
};

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }

    next();
  };
};

module.exports = { authenticateToken, validate };