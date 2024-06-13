const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // Tên đăng nhập
    username: {
      type: String,
      required: true,
    },
    // Mật khẩu người dùng
    password: {
      type: String,
      required: true,
    },
    // Họ và tên của người dùng
    fullName: {
      type: String,
      required: true,
    },
    // Số điện thoại của người dùng
    phoneNumber: {
      type: Number,
      required: true,
    },
    // Email của người dùng
    email: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    reserve: {
      items: [
        {
          propertyId: {
            type: Object,
            ref: 'Property',
            required: true,
          },

          startDate: {
            type: String,
            required: true,
          },
          endDate: {
            type: String,
            required: true,
          },
        },
      ],
    },
    // Người dùng này có phải Admin không
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect username');
};

userSchema.methods.addToReserve = function (
  property,
  // room,
  startDate,
  endDate
) {
  const reserveIndex = this.reserve.items.findIndex(item => {
    return (
      item.propertyId.toString() === property._id.toString() &&
      // item.roomId.toString() === room._id.toString() &&
      item.startDate.toString() === startDate.toString() &&
      item.endDate.toString() === endDate.toString()
    );
  });

  const updatedReserveItems = [...this.reserve.items];

  if (reserveIndex >= 0) {
    return;
  } else {
    updatedReserveItems.push({
      propertyId: property._id,
      // roomId: room._id,
      startDate: startDate,
      endDate: endDate,
    });
  }

  const updatedReserve = {
    items: updatedReserveItems,
  };

  this.reserve = updatedReserve;
  return this.save();
};

// userSchema.methods.removeFromReserve = function (id) {
//   const updatedReserveItems = this.reserve.items.filter(item => {
//     return item._id.toString() !== id.toString();
//   });
//   this.reserve.items = updatedReserveItems;
//   return this.save();
// };

userSchema.methods.clearReserve = function () {
  this.reserve = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
