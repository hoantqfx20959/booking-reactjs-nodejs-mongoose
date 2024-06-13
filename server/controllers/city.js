const City = require('../models/city');

// 'get' lấy dữ liệu; 'post' gửi dữ liệu;
exports.getCities = async (req, res, next) => {
  try {
    await City.find().then(cities => {
      res.status(200).json({
        message: 'City fetched.',
        items: cities,
      });
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getCity = async (req, res, next) => {
  const cityId = req.params.id;
  try {
    const city = await City.findById(cityId).populate({
      path: 'properties.propertyId',
      populate: {
        path: 'rooms.roomId',
        populate: { path: 'roomNumbers.roomNumberId' },
      },
    });

    res.status(200).json({
      message: 'City fetched.',
      item: city,
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};
