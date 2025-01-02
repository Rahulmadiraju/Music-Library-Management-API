// src/models/albumModel.js
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class AlbumModel {
  static async createAlbum(artistId, name, year, hidden) {
    const query = `
      INSERT INTO albums (album_id, artist_id, name, year, hidden)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [uuidv4(), artistId, name, year, hidden];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAllAlbums(limit = 5, offset = 0, artistId = null, hidden = null) {
    let query = `
      SELECT a.*, art.name as artist_name
      FROM albums a
      JOIN artists art ON a.artist_id = art.artist_id
      WHERE 1=1
    `;
    const values = [];

    if (artistId) {
      query += ` AND a.artist_id = $${values.length + 1}`;
      values.push(artistId);
    }

    if (hidden !== null) {
      query += ` AND a.hidden = $${values.length + 1}`;
      values.push(hidden);
    }

    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getAlbumById(albumId) {
    const query = `
      SELECT a.*, art.name as artist_name
      FROM albums a
      JOIN artists art ON a.artist_id = art.artist_id
      WHERE a.album_id = $1
    `;
    const result = await pool.query(query, [albumId]);
    return result.rows[0];
  }

  static async updateAlbum(albumId, updates) {
    const allowedUpdates = ['name', 'year', 'hidden'];
    const values = [];
    let setClause = '';

    Object.keys(updates).forEach((key, index) => {
      if (allowedUpdates.includes(key)) {
        setClause += `${index !== 0 ? ',' : ''} ${key} = $${values.length + 1}`;
        values.push(updates[key]);
      }
    });

    if (!setClause) return null;

    values.push(albumId);
    const query = `
      UPDATE albums 
      SET ${setClause} 
      WHERE album_id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteAlbum(albumId) {
    const query = 'DELETE FROM albums WHERE album_id = $1 RETURNING *';
    const result = await pool.query(query, [albumId]);
    return result.rows[0];
  }
}

module.exports = AlbumModel;