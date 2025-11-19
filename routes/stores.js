const express = require('express');
const router = express.Router();
const { getStoreByStoreNumber } = require('../controllers/storesController');

// Sin parámetro → retorna todo
router.get('/', getStoreByStoreNumber);
// Con parámetro
router.get('/:search', getStoreByStoreNumber);

module.exports = router;