const User = require('../models/user');
const jwt = require('jsonwebtoken');

// check user
const verifyToken = (req, res, next, func) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(
      token,
      'kishan sheth super secret key',
      async (err, decodedToken) => {
        if (err) {
          res.json({ status: false });
          next();
        } else {
          const user = await User.findById(decodedToken.id);
          if (user) {
            req.user = user;
            func();
            next();
          } else res.json({ status: false });
          next();
        }
      }
    );
  } else {
    res.json({ status: false });
    next();
  }
};

module.exports.checkUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (!req.user.isAdmin) {
      res.json({ status: true, user: req.user.username });
    } else {
      res.json({ status: false });
    }
  });
};

module.exports.checkAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      res.json({ status: true, user: req.user.username });
    } else {
      res.json({ status: false });
    }
  });
};
