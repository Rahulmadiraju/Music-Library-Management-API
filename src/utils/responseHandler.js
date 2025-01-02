// src/utils/responseHandler.js
const successResponse = (status, data, message) => ({
    status,
    data,
    message,
    error: null
  });
  
  const errorResponse = (status, message) => ({
    status,
    data: null,
    message,
    error: null
  });
  
  module.exports = { successResponse, errorResponse };



  