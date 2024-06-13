const Transaction = require('../models/transaction');
const Property = require('../models/property');
const RoomNumber = require('../models/roomNumber');

// 'get' lấy dữ liệu; 'post' gửi dữ liệu;
exports.getUser = async (req, res, next) => {
  try {
    const user = await req.user;
    res.status(200).json({
      user,
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getReserve = async (req, res, next) => {
  try {
    await req.user.populate({
      path: 'reserve.items.propertyId',
      populate: {
        path: 'rooms.roomId',
        populate: { path: 'roomNumbers.roomNumberId' },
      },
    });

    const reserve = req.user.reserve.items.at(-1);

    if (reserve) {
      const today = new Date().getTime();
      const startDate = new Date(reserve.startDate).getTime();
      const endDate = new Date(reserve.endDate).getTime();

      if (startDate < today) {
        req.user.reserve.items.at(-1).startDate = new Date();
      }

      if (endDate < today) {
        req.user.reserve.items.at(-1).endDate = new Date();
      }
    }

    res.status(200).json({
      message: 'Fetched reserve successfully.',
      item: req.user,
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.postReserve = async (req, res, next) => {
  try {
    const propertyId = req.body.propertyId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;

    // thêm vào danh sách lựa chọn
    await Property.findById(propertyId).then(property => {
      req.user.addToReserve(property, startDate, endDate);
      res.status(201).json('Add to reserve');
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    await Transaction.find({ 'user.userId': req.user._id }).then(
      transaction => {
        res.status(200).json({
          message: 'Fetched transaction successfully.',
          items: transaction,
        });
      }
    );
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.postTransaction = async (req, res, next) => {
  try {
    const transaction = new Transaction({
      user: {
        username: req.user.username,
        userId: req.user,
      },
      property: req.body.property.name,
      room: req.body.checkRoom.map(item => item.roomNumber),
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      price: req.body.price,
      payment: req.body.payment,
      // status: 'booked',
    });

    // đặt hàng
    req.body.checkRoom.map(async item => {
      await RoomNumber.findById(item.id).then(roomNumber => {
        roomNumber.unavailableDates = req.body.dates;
        return roomNumber.save();
      });
    });

    await transaction.save();
    req.user.clearReserve();

    res.status(201).json('Transaction booked');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getAdminTransaction = async (req, res, next) => {
  try {
    await Transaction.find().then(transaction => {
      res.status(200).json({
        message: 'transaction fetched.',
        items: transaction,
      });
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};
