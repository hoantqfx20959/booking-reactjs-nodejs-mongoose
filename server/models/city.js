const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const citySchema = new Schema(
  {
    // Tên
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // Danh sách các link ảnh
    photos: {
      type: [String],
    },
    // Danh sách các phòng thuộc khách sạn này
    properties: [
      {
        propertyId: {
          type: Object,
          ref: 'Property',
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('City', citySchema);
