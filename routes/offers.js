const express = require('express');
const router = express.Router();
const { getPromoBySku } = require('../controllers/offersController');

// Ruta exacta que pediste
router.get('/items-codes-promotions/FMCITY/:sku/:store/:start/:end/:offset/:max', getPromoBySku);

module.exports = router;
