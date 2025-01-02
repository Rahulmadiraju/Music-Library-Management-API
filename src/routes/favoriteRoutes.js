// src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favoriteController');
const { authenticateToken, validate } = require('../middleware/auth');
const { favoriteValidation, categoryValidation, idValidation } = require('../utils/validators');

router.get('/:category', authenticateToken, validate(categoryValidation), FavoriteController.getFavorites);
router.post('/add-favorite', authenticateToken, validate(favoriteValidation), FavoriteController.addFavorite);
router.delete('/remove-favorite/:id', authenticateToken, validate(idValidation), FavoriteController.removeFavorite);

module.exports = router;
