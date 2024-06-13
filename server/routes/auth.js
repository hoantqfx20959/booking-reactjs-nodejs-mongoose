const express = require('express');
// check dữ liệu nhập
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
// check user
const { checkUser, checkAdmin } = require('../middlewares/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/api/admin/user', authController.getUser);

router.post('/check-user', checkUser);

router.post('/check-admin', checkAdmin);

router.post(
  '/login',
  [
    body('username', 'Please enter a valid Username.').isAlphanumeric(),
    body('password', 'Password has to be valid.')
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('username', 'Please enter a valid Username.')
      .isAlphanumeric()
      .custom(async (value, { req }) => {
        return User.findOne({ username: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'Username exists already, please pick a different one.'
            );
          }
        });
      }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body('fullName', 'Please enter a valid Full Name.').exists(),
    body('phoneNumber', 'Please enter a valid Phone Number.').isMobilePhone(),
    body('email', 'Please enter a valid E-Mail.').isEmail(),
  ],
  authController.postSignup
);

router.post(
  '/reset',
  [
    check('username', 'Please enter a valid Username.')
      .isAlphanumeric()
      .custom(async (value, { req }) => {
        return User.findOne({ username: value }).then(userDoc => {
          if (!userDoc) {
            return Promise.reject('No account with that username found.');
          }
        });
      }),
  ],
  authController.postReset
);

router.get('/reset/:token', authController.getNewPassword);

router.post(
  '/new-password',
  [
    body(
      'password',
      'Please enter a password with only numbers and text and at least 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postNewPassword
);

module.exports = router;
