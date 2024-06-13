const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    // Username của người đặt phòng
    user: {
      username: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    // _Id của khách sạn đã đặt
    property: {
      type: String,
      required: true,
    },
    // Danh sách các phòng đã đặt
    room: [
      {
        type: String,
        required: true,
      },
    ],
    // Ngày nhận phòng
    dateStart: {
      type: Date,
      required: true,
    },
    // Ngày trả phòng
    dateEnd: {
      type: Date,
      required: true,
    },
    // Chi phí
    price: {
      type: Number,
      required: true,
    },
    // Hình thức thanh toán (Credit Card, Cash)
    payment: {
      type: String,
      required: true,
    },
    // Tình trạng (Booked, Checkin, Checkout)
    status: {
      type: String,
      required: true,
      default: 'Booked',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
