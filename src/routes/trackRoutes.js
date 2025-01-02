// src/routes/trackRoutes.js
const express = require('express');
const router = express.Router();
const TrackController = require('../controllers/trackController');
const { authenticateToken, validate } = require('../middleware/auth');
const { isAdminOrEditor } = require('../middleware/roleCheck');
const { trackValidation, paginationValidation, idValidation } = require('../utils/validators');

router.get('/', authenticateToken, validate(paginationValidation), TrackController.getAllTracks);
router.get('/:id', authenticateToken, validate(idValidation), TrackController.getTrackById);
router.post('/add-track', authenticateToken, validate(trackValidation), TrackController.addTrack);
router.put('/:id', authenticateToken, isAdminOrEditor, validate(idValidation), TrackController.updateTrack);
router.delete('/:id', authenticateToken, isAdminOrEditor, validate(idValidation), TrackController.deleteTrack);

module.exports = router;
