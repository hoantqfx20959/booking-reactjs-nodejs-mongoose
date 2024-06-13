const express = require('express');

const cityController = require('../controllers/city');

const router = express.Router();

router.get('/cities', cityController.getCities);

router.get('/city/:id', cityController.getCity);

module.exports = router;
