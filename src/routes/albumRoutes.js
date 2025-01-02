// src/routes/albumRoutes.js
const express = require('express');
const router = express.Router();
const AlbumController = require('../controllers/albumController');
const { authenticateToken, validate } = require('../middleware/auth');
const { isAdminOrEditor } = require('../middleware/roleCheck');
const { albumValidation, paginationValidation, idValidation } = require('../utils/validators');

router.get('/', authenticateToken, validate(paginationValidation), AlbumController.getAllAlbums);
router.get('/:id', authenticateToken, validate(idValidation), AlbumController.getAlbumById);
router.post('/add-album', authenticateToken, validate(albumValidation), AlbumController.addAlbum);
router.put('/:id', authenticateToken, isAdminOrEditor, validate(idValidation), AlbumController.updateAlbum);
router.delete('/:id', authenticateToken, isAdminOrEditor, validate(idValidation), AlbumController.deleteAlbum);

module.exports = router;