const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://asm2:Hoan1104@cluster0.m0gba0l.mongodb.net/booking';

const app = express();

const cityRoutes = require('./routes/city');
const propertyRoutes = require('./routes/property');
const roomRoutes = require('./routes/room');
const transactionRoutes = require('./routes/transaction');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false })); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

// app.use(cors());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    // methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());

app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next();
  }
  jwt.verify(
    token,
    'kishan sheth super secret key',
    async (err, decodedToken) => {
      if (err) {
        return next();
      }
      await User.findById(decodedToken.id)
        .then(user => {
          req.user = user;
          next();
        })
        .catch(err => console.log(err));
    }
  );
});

app.use('/api', cityRoutes);
app.use('/api', propertyRoutes);
app.use('/api', roomRoutes);
app.use('/api', transactionRoutes);
app.use(authRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
