// src/controllers/albumController.js
const AlbumModel = require('../models/albumModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class AlbumController {
  static async getAllAlbums(req, res) {
    try {
      const { limit, offset, artist_id, hidden } = req.query;
      const albums = await AlbumModel.getAllAlbums(
        parseInt(limit) || 5,
        parseInt(offset) || 0,
        artist_id,
        hidden === 'true'
      );
      return res.status(200).json(successResponse(200, albums, 'Albums retrieved successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async getAlbumById(req, res) {
    try {
      const { id } = req.params;
      const album = await AlbumModel.getAlbumById(id);
      
      if (!album) {
        return res.status(404).json(errorResponse(404, 'Album not found.'));
      }

      return res.status(200).json(successResponse(200, album, 'Album retrieved successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async addAlbum(req, res) {
    try {
      const { artist_id, name, year, hidden } = req.body;
      const album = await AlbumModel.createAlbum(artist_id, name, year, hidden);
      return res.status(201).json(successResponse(201, null, 'Album created successfully.'));
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        return res.status(404).json(errorResponse(404, 'Artist not found.'));
      }
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async updateAlbum(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const album = await AlbumModel.updateAlbum(id, updates);
      if (!album) {
        return res.status(404).json(errorResponse(404, 'Album not found.'));
      }

      return res.status(204).end();
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async deleteAlbum(req, res) {
    try {
      const { id } = req.params;
      const album = await AlbumModel.deleteAlbum(id);
      
      if (!album) {
        return res.status(404).json(errorResponse(404, 'Album not found.'));
      }

      return res.status(200).json(successResponse(200, null, `Album:${album.name} deleted successfully.`));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }
}

module.exports = AlbumController;






