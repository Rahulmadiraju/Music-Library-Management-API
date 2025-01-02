// src/models/userModel.js
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class UserModel {
  static async createUser(email, password, role = 'viewer') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (user_id, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, email, role
    `;
    const values = [uuidv4(), email, hashedPassword, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async getUserById(userId) {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async getAllUsers(limit = 5, offset = 0, role = null) {
    let query = `
      SELECT user_id, email, role, created_at 
      FROM users 
      WHERE role != 'admin'
    `;
    const values = [];

    if (role) {
      query += ' AND role = $1';
      values.push(role);
    }

    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `
      UPDATE users 
      SET password = $1 
      WHERE user_id = $2 
      RETURNING user_id
    `;
    const result = await pool.query(query, [hashedPassword, userId]);
    return result.rows[0];
  }

  static async deleteUser(userId) {
    const query = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = UserModel;