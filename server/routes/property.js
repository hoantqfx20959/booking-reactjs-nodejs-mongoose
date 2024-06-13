const express = require('express');
// check dữ liệu nhập
const { check, body } = require('express-validator');

const propertyController = require('../controllers/property');

const router = express.Router();

router.get('/properties', propertyController.getProperties);

router.get('/properties-by-city/:city', propertyController.getPropertiesByCity);

router.get('/properties-by-type/:type', propertyController.getPropertiesByType);

router.get('/property/:id', propertyController.getProperty);

router.get('/search', propertyController.getSearch);

router.post(
  '/properties',
  [
    body('name').isString().isLength({ min: 3 }).trim(),
    body('city').isString().trim(),
    body('address').isString().trim(),
    body('distance').isFloat(),
    body('title').isString().isLength({ min: 3 }).trim(),
    body('desc').isLength({ min: 5, max: 500 }).trim(),
    body('cheapestPrice').isFloat(),
  ],
  propertyController.postProperty
);

router.put(
  '/property/:id',
  [
    body('name').isString().isLength({ min: 3 }).trim(),
    body('city').isString().trim(),
    body('address').isString().trim(),
    body('distance').isFloat(),
    body('title').isString().isLength({ min: 3 }).trim(),
    body('desc').isLength({ min: 5, max: 500 }).trim(),
    body('cheapestPrice').isFloat(),
  ],
  propertyController.putProperty
);

router.delete('/property', propertyController.deleteProperty);

module.exports = router;
