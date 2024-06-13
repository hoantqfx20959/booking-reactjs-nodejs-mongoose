const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.get('/:id', userController.getUser);

router.put('/:id', userController.putUser);

router.delete('/:id', userController.deleteUser);

router.get('/', userController.getUsers);

module.exports = router;
