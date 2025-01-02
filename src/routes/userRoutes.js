// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken, validate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const { userValidation, paginationValidation, idValidation } = require('../utils/validators');

router.get('/', authenticateToken, isAdmin, validate(paginationValidation), UserController.getAllUsers);
router.post('/add-user', authenticateToken, isAdmin, validate(userValidation), UserController.addUser);
router.put('/update-password', authenticateToken, UserController.updatePassword);
router.delete('/:id', authenticateToken, isAdmin, validate(idValidation), UserController.deleteUser);

module.exports = router;