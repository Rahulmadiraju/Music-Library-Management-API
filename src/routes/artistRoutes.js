// src/routes/artistRoutes.js
const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/artistController');
const { authenticateToken, validate } = require('../middleware/auth');
const { isAdminOrEditor } = require('../middleware/roleCheck');
const { artistValidation, paginationValidation, idValidation } = require('../utils/validators');

router.get('/', authenticateToken, validate(paginationValidation), ArtistController.getAllArtists);
router.get('/:id', authenticateToken, validate(idValidation), ArtistController.getArtistById);
router.post('/add-artist', authenticateToken, validate(artistValidation), ArtistController.addArtist);
router.put('/:id', authenticateToken, isAdminOrEditor, validate(idValidation), ArtistController.updateArtist);
router.delete('/:id', authenticateToken, isAdminOrEditor, validate(idValidation), ArtistController.deleteArtist);

module.exports = router;