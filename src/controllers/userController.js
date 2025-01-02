// src/controllers/userController.js
const UserModel = require('../models/userModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const { limit, offset, role } = req.query;
      const users = await UserModel.getAllUsers(limit, offset, role);
      return res.status(200).json(successResponse(200, users, 'Users retrieved successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async addUser(req, res) {
    try {
      const { email, password, role } = req.body;

      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json(errorResponse(409, 'Email already exists.'));
      }

      await UserModel.createUser(email, password, role);
      return res.status(201).json(successResponse(201, null, 'User created successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async updatePassword(req, res) {
    try {
      const { old_password, new_password } = req.body;
      const userId = req.user.userId;

      const user = await UserModel.getUserById(userId);
      if (!user) {
        return res.status(404).json(errorResponse(404, 'User not found.'));
      }

      const isValidPassword = await bcrypt.compare(old_password, user.password);
      if (!isValidPassword) {
        return res.status(400).json(errorResponse(400, 'Invalid old password.'));
      }

      await UserModel.updatePassword(userId, new_password);
      return res.status(204).end();
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.deleteUser(id);
      
      if (!user) {
        return res.status(404).json(errorResponse(404, 'User not found.'));
      }

      return res.status(200).json(successResponse(200, null, 'User deleted successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }
}

module.exports = UserController;