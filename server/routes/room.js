const express = require('express');
// check dữ liệu nhập
const { check, body } = require('express-validator');

const roomController = require('../controllers/room');

const router = express.Router();

router.get('/rooms', roomController.getRooms);

router.get('/room/:id', roomController.getRoom);

router.post(
  '/rooms',
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('desc').isLength({ min: 5, max: 500 }).trim(),
    body('price').isFloat(),
    body('maxPeople').isFloat(),
    body('propertyId').isMongoId(),
  ],
  roomController.postRoom
);

router.put(
  '/room/:id',
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('desc').isLength({ min: 5, max: 500 }).trim(),
    body('price').isFloat(),
    body('maxPeople').isFloat(),
    body('propertyId').isMongoId(),
  ],
  roomController.putRoom
);

router.delete('/room', roomController.deleteRoom);

// router.put('/roomNumber/:id', roomController.putRoomAvailability);

module.exports = router;
