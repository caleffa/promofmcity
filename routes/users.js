const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyToken = require('../middleware/verifyToken');

// rutas protegidas
router.get('/', verifyToken, usersController.getAllUsers);
router.post('/', usersController.createUser);
router.put('/:id', verifyToken, usersController.updateUser);
router.delete('/:id', verifyToken, usersController.deleteUser);
router.get("/:id", verifyToken, usersController.getUserById);

// ruta sin token
router.post('/login', usersController.loginUser);

module.exports = router;