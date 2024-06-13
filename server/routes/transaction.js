const express = require('express');

const transactionController = require('../controllers/transaction');

const router = express.Router();

router.get('/admin/transaction', transactionController.getAdminTransaction);

router.get('/user', transactionController.getUser);

router.get('/reserve', transactionController.getReserve);

router.post('/reserve', transactionController.postReserve);

router.get('/transaction', transactionController.getTransaction);

router.post('/transaction', transactionController.postTransaction);

module.exports = router;
