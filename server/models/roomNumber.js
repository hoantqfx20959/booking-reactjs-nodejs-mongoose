const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomNumberSchema = new Schema(
  {
    number: Number,
    unavailableDates: { type: [Date] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoomNumber', roomNumberSchema);
