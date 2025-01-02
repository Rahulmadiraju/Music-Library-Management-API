// src/controllers/favoriteController.js
const FavoriteModel = require('../models/favoriteModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class FavoriteController {
  static async getFavorites(req, res) {
    try {
      const { category } = req.params;
      const { limit, offset } = req.query;
      const userId = req.user.userId;

      if (!['artist', 'album', 'track'].includes(category)) {
        return res.status(400).json(errorResponse(400, 'Invalid category.'));
      }

      const favorites = await FavoriteModel.getFavorites(
        userId,
        category,
        parseInt(limit) || 5,
        parseInt(offset) || 0
      );
      return res.status(200).json(successResponse(200, favorites, 'Favorites retrieved successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async addFavorite(req, res) {
    try {
      const { category, item_id } = req.body;
      const userId = req.user.userId;

      if (!['artist', 'album', 'track'].includes(category)) {
        return res.status(400).json(errorResponse(400, 'Invalid category.'));
      }

      const favorite = await FavoriteModel.addFavorite(userId, category, item_id);
      return res.status(201).json(successResponse(201, null, 'Favorite added successfully.'));
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        return res.status(404).json(errorResponse(404, 'Item not found.'));
      } else if (error.code === '23505') { // Unique violation
        return res.status(400).json(errorResponse(400, 'Item already in favorites.'));
      }
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async removeFavorite(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      const favorite = await FavoriteModel.removeFavorite(id, userId);
      if (!favorite) {
        return res.status(404).json(errorResponse(404, 'Favorite not found.'));
      }

      return res.status(200).json(successResponse(200, null, 'Favorite removed successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }
}

module.exports = FavoriteController;