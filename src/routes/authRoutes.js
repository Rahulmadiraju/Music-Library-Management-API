// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validate } = require('../middleware/auth');
const { signupValidation, loginValidation } = require('../utils/validators');

router.post('/signup', validate(signupValidation), AuthController.signup);
router.post('/login', validate(loginValidation), AuthController.login);
router.get('/logout', AuthController.logout);

module.exports = router;