// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { generateToken } = require('../config/jwt');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AuthController {
  static async signup(req, res) {
    try {
      const { email, password } = req.body;

      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json(errorResponse(409, 'Email already exists.'));
      }

      // First user becomes admin
      const users = await UserModel.getAllUsers();
      const role = users.length === 0 ? 'admin' : 'viewer';

      await UserModel.createUser(email, password, role);
      return res.status(201).json(successResponse(201, null, 'User created successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json(errorResponse(404, 'User not found.'));
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json(errorResponse(400, 'Invalid credentials.'));
      }

      const token = generateToken(user.user_id, user.role);
      return res.status(200).json(successResponse(200, { token }, 'Login successful.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async logout(req, res) {
    try {
      // In a real application, you might want to invalidate the token here
      return res.status(200).json(successResponse(200, null, 'User logged out successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }
}

module.exports = AuthController;