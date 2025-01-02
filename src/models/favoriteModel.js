// src/models/favoriteModel.js
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class FavoriteModel {
  static async addFavorite(userId, category, itemId) {
    const query = `
      INSERT INTO favorites (favorite_id, user_id, category, item_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [uuidv4(), userId, category, itemId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getFavorites(userId, category, limit = 5, offset = 0) {
    let query;
    const values = [userId, category];

    switch (category) {
      case 'artist':
        query = `
          SELECT f.favorite_id, f.category, f.item_id, a.name, f.created_at
          FROM favorites f
          JOIN artists a ON f.item_id = a.artist_id
          WHERE f.user_id = $1 AND f.category = $2
        `;
        break;
      case 'album':
        query = `
          SELECT f.favorite_id, f.category, f.item_id, a.name, f.created_at
          FROM favorites f
          JOIN albums a ON f.item_id = a.album_id
          WHERE f.user_id = $1 AND f.category = $2
        `;
        break;
      case 'track':
        query = `
          SELECT f.favorite_id, f.category, f.item_id, t.name, f.created_at
          FROM favorites f
          JOIN tracks t ON f.item_id = t.track_id
          WHERE f.user_id = $1 AND f.category = $2
        `;
        break;
      default:
        throw new Error('Invalid category');
    }

    query += ` LIMIT $3 OFFSET $4`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async removeFavorite(favoriteId, userId) {
    const query = `
      DELETE FROM favorites 
      WHERE favorite_id = $1 AND user_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [favoriteId, userId]);
    return result.rows[0];
  }
}

module.exports = FavoriteModel;