// src/models/artistModel.js
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ArtistModel {
  static async createArtist(name, grammy, hidden) {
    const query = `
      INSERT INTO artists (artist_id, name, grammy, hidden)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [uuidv4(), name, grammy, hidden];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAllArtists(limit = 5, offset = 0, grammy = null, hidden = null) {
    let query = 'SELECT * FROM artists WHERE 1=1';
    const values = [];

    if (grammy !== null) {
      query += ` AND grammy = $${values.length + 1}`;
      values.push(grammy);
    }

    if (hidden !== null) {
      query += ` AND hidden = $${values.length + 1}`;
      values.push(hidden);
    }

    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async getArtistById(artistId) {
    const query = 'SELECT * FROM artists WHERE artist_id = $1';
    const result = await pool.query(query, [artistId]);
    return result.rows[0];
  }

  static async updateArtist(artistId, updates) {
    const allowedUpdates = ['name', 'grammy', 'hidden'];
    const values = [];
    let setClause = '';

    Object.keys(updates).forEach((key, index) => {
      if (allowedUpdates.includes(key)) {
        setClause += `${index !== 0 ? ',' : ''} ${key} = $${values.length + 1}`;
        values.push(updates[key]);
      }
    });

    if (!setClause) return null;

    values.push(artistId);
    const query = `
      UPDATE artists 
      SET ${setClause} 
      WHERE artist_id = $${values.length}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteArtist(artistId) {
    const query = 'DELETE FROM artists WHERE artist_id = $1 RETURNING *';
    const result = await pool.query(query, [artistId]);
    return result.rows[0];
  }
}

module.exports = ArtistModel;
