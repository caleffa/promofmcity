const express = require('express');
const router = express.Router();
const { getItemsByDescription } = require('../controllers/itemsController');

router.get('/items-description/:search', getItemsByDescription);

module.exports = router;