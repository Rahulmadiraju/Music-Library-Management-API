// src/controllers/trackController.js
const TrackModel = require('../models/trackModel');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class TrackController {
  static async getAllTracks(req, res) {
    try {
      const { limit, offset, artist_id, album_id, hidden } = req.query;
      const tracks = await TrackModel.getAllTracks(
        parseInt(limit) || 5,
        parseInt(offset) || 0,
        artist_id,
        album_id,
        hidden === 'true'
      );
      return res.status(200).json(successResponse(200, tracks, 'Tracks retrieved successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async getTrackById(req, res) {
    try {
      const { id } = req.params;
      const track = await TrackModel.getTrackById(id);
      
      if (!track) {
        return res.status(404).json(errorResponse(404, 'Track not found.'));
      }

      return res.status(200).json(successResponse(200, track, 'Track retrieved successfully.'));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async addTrack(req, res) {
    try {
      const { artist_id, album_id, name, duration, hidden } = req.body;
      const track = await TrackModel.createTrack(artist_id, album_id, name, duration, hidden);
      return res.status(201).json(successResponse(201, null, 'Track created successfully.'));
    } catch (error) {
      if (error.code === '23503') { // Foreign key violation
        return res.status(404).json(errorResponse(404, 'Artist or Album not found.'));
      }
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async updateTrack(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const track = await TrackModel.updateTrack(id, updates);
      if (!track) {
        return res.status(404).json(errorResponse(404, 'Track not found.'));
      }

      return res.status(204).end();
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }

  static async deleteTrack(req, res) {
    try {
      const { id } = req.params;
      const track = await TrackModel.deleteTrack(id);
      
      if (!track) {
        return res.status(404).json(errorResponse(404, 'Track not found.'));
      }

      return res.status(200).json(successResponse(200, null, `Track:${track.name} deleted successfully.`));
    } catch (error) {
      return res.status(400).json(errorResponse(400, 'Bad Request'));
    }
  }
}

module.exports = TrackController;