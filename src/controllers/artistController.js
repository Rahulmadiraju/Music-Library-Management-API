// src/controllers/artistController.js
const ArtistModel = require('../models/artistModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class ArtistController {
  static async getAllArtists(req, res) {
    try {
      const { limit, offset, grammy, hidden } = req.query;
      const artists = await ArtistModel.getAllArtists(
        parseInt(limit) || 5,
        parseInt(offset) || 0,
        grammy ? parseInt(grammy) : null,
        hidden === 'true'
      );
      return res.status(200).json(successResponse(200, artists, 'Artists retrieved successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async getArtistById(req, res) {
    try {
      const { id } = req.params;
      const artist = await ArtistModel.getArtistById(id);
      
      if (!artist) {
        return res.status(404).json(errorResponse(404, 'Artist not found.'));
      }

      return res.status(200).json(successResponse(200, artist, 'Artist retrieved successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async addArtist(req, res) {
    try {
      const { name, grammy, hidden } = req.body;
      const artist = await ArtistModel.createArtist(name, grammy, hidden);
      return res.status(201).json(successResponse(201, null, 'Artist created successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async updateArtist(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const artist = await ArtistModel.updateArtist(id, updates);
      if (!artist) {
        return res.status(404).json(errorResponse(404, 'Artist not found.'));
      }

      return res.status(204).end();
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async deleteArtist(req, res) {
    try {
      const { id } = req.params;
      const artist = await ArtistModel.deleteArtist(id);
      
      if (!artist) {
        return res.status(404).json(errorResponse(404, 'Artist not found.'));
      }

      return res.status(200).json(successResponse(200, null, `Artist:${artist.name} deleted successfully.`));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }
}

module.exports = ArtistController;