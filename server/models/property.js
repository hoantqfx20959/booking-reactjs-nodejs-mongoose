const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    // Tên của khách sạn
    name: {
      type: String,
      required: true,
    },
    // Loại khách sạn (Hotel, Apartment, Resort, Villa, Cabin)
    type: {
      type: String,
      required: true,
    },
    // Thành phố của khách sạn đó
    city: {
      type: String,
      required: true,
    },
    // Địa chỉ cụ thể của khách sạn
    address: {
      type: String,
      required: true,
    },
    // Khoảng cách từ khách sạn đến trung tâm thành phố
    distance: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // Danh sách các link ảnh của khách sạn đó
    photos: {
      type: [String],
    },
    // Giới thiệu về khách sạn
    desc: {
      type: String,
      required: true,
    },
    // Giá rẻ nhất
    cheapestPrice: {
      type: Number,
      required: true,
    },
    // Đánh giá về khách sạn đó (trong khoảng 0 -> 5 điểm)
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    rate_text: {
      type: String,
      required: true,
    },
    // Khách sạn có hỗ trợ các tiện ích khác không
    featured: {
      type: Boolean,
      default: false,
    },
    // Danh sách các phòng thuộc khách sạn này
    rooms: [
      {
        roomId: {
          type: Schema.Types.ObjectId,
          ref: 'Room',
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
