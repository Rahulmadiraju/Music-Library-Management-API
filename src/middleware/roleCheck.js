// src/middleware/roleCheck.js
const { errorResponse } = require('../utils/responseHandler');

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(errorResponse(403, 'Forbidden Access'));
    }
    next();
  };
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(errorResponse(403, 'Forbidden Access'));
  }
  next();
};

const isAdminOrEditor = (req, res, next) => {
  if (!['admin', 'editor'].includes(req.user.role)) {
    return res.status(403).json(errorResponse(403, 'Forbidden Access'));
  }
  next();
};

module.exports = { checkRole, isAdmin, isAdminOrEditor };
