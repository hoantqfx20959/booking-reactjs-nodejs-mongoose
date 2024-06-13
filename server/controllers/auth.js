const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
// check dữ liệu nhập
const { validationResult } = require('express-validator');

const User = require('../models/user');
const { SENDMAIL, HTML_TEMPLATE } = require('../mail/mailer.js');

// thời gian dăng nhập
const maxAge = 3 * 24 * 60 * 60;

// tạo token
const createToken = id => {
  return jwt.sign({ id }, 'kishan sheth super secret key', {
    expiresIn: maxAge,
  });
};

// báo lỗi
const handleErrors = err => {
  let errors = { username: '', password: '' };

  console.log(err);
  if (err.message === 'incorrect username') {
    errors.username = 'That username is not registered';
  }

  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  if (err.code === 11000) {
    errors.username = 'Username is already registered';
    return errors;
  }

  if (err.message.includes('Users validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// gửi mail
const transporter = ({
  to: mail,
  subject: subjectText,
  message: messageText,
}) => {
  SENDMAIL(
    {
      from: 'BOOKING <booking@node-complete.com>',
      to: mail,
      subject: subjectText,
      text: messageText,
      html: HTML_TEMPLATE(messageText),
    },
    info => {
      console.log('Email sent successfully');
      console.log('MESSAGE ID: ', info.messageId);
    }
  );
};

// 'get' lấy dữ liệu; 'post' gửi dữ liệu;
exports.getUser = async (req, res, next) => {
  try {
    await User.find().then(user => {
      res.status(200).json({
        message: 'User fetched.',
        items: user,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          username: username,
          password: password,
        },
        validationErrors: errors.array(),
      });
    }

    const user = await User.login(username, password);
    const token = createToken(user._id);
    // dùng cookie để xử lý user
    res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const { username, password, fullName, phoneNumber, email, isAdmin } =
      req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          username: username,
          password: password,
          fullName: fullName,
          phoneNumber: phoneNumber,
          email: email,
          isAdmin: isAdmin,
        },
        validationErrors: errors.array(),
      });
    }

    const user = await User.create({
      username,
      password,
      fullName,
      phoneNumber,
      email,
      isAdmin,
    });
    const token = createToken(user._id);

    res.cookie('jwt', token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id, created: true });

    transporter({
      to: email,
      subject: 'Signup succeeded!',
      message: 'You successfully signed up!',
    });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

exports.postReset = async (req, res, next) => {
  try {
    const url = req.get('origin');
    // tạo mã hóa reset và gửi link reset
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
        res.json({ err, status: false });
      }
      const token = buffer.toString('hex');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errorMessage: errors.array()[0].msg,
          oldInput: {
            username: req.body.username,
          },
          validationErrors: errors.array(),
        });
      }
      const user = await User.findOne({ username: req.body.username });
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 10 * 60 * 60 * 1000;
      user.save();
      res.status(200).json({ user: user._id, status: true });
      transporter({
        to: user.email,
        subject: 'Password reset',
        message: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${url}/reset/${token}">link</a>   to set a new password.</p>
      `,
      });
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const token = req.params.token;

    await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    }).then(user => {
      res.status(200).json({
        userId: user._id.toString(),
        resetToken: token,
      });
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const resetToken = req.body.resetToken;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          username: req.body.username,
        },
        validationErrors: errors.array(),
      });
    }

    const resetUser = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    resetUser.password = newPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    resetUser.save();

    const token = createToken(resetUser._id);
    res.cookie('jwt', token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: resetUser._id, created: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};
