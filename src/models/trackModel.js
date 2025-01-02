// src/models/trackModel.js
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class TrackModel {
  static async createTrack(artistId, albumId, name, duration, hidden) {
    const query = `
      INSERT INTO tracks (track_id, artist_id, album_id, name, duration, hidden)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [uuidv4(), artistId, albumId, name, duration, hidden];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAllTracks(limit = 5, offset = 0, artistId = null, albumId = null, hidden = null) {
    let query = `
      SELECT t.*, art.name as artist_name, alb.name as album_name
      FROM tracks t
      JOIN artists art ON t.artist_id = art.artist_id
      JOIN albums alb ON t.album_id = alb.album_id
      WHERE 1=1
    `;
    const values = [];

    if (artistId) {
      query += ` AND t.artist_id = $${values.length + 1}`;
      values.push(artistId);
    }

    if (albumId) {
      query += ` AND t.album_id = $${values.length + 1}`;
      values.push(albumId);
    }

    if (hidden !== null) {
      query += ` AND t.hidden = $${values.length + 1}`;
      values.push(hidden);
    }

    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getTrackById(trackId) {
    const query = `
      SELECT t.*, art.name as artist_name, alb.name as album_name
      FROM tracks t
      JOIN artists art ON t.artist_id = art.artist_id
      JOIN albums alb ON t.album_id = alb.album_id
      WHERE t.track_id = $1
    `;
    const result = await pool.query(query, [trackId]);
    return result.rows[0];
  }

  static async updateTrack(trackId, updates) {
    const allowedUpdates = ['name', 'duration', 'hidden'];
    const values = [];
    let setClause = '';

    Object.keys(updates).forEach((key, index) => {
      if (allowedUpdates.includes(key)) {
        setClause += `${index !== 0 ? ',' : ''} ${key} = $${values.length + 1}`;
        values.push(updates[key]);
      }
    });

    if (!setClause) return null;

    values.push(trackId);
    const query = `
      UPDATE tracks 
      SET ${setClause} 
      WHERE track_id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteTrack(trackId) {
    const query = 'DELETE FROM tracks WHERE track_id = $1 RETURNING *';
    const result = await pool.query(query, [trackId]);
    return result.rows[0];
  }
}

module.exports = TrackModel;