const City = require('../models/city');
const Property = require('../models/property');
const Room = require('../models/room');
const RoomNumber = require('../models/roomNumber');
const { validationResult } = require('express-validator');

// 'get' lấy dữ liệu; 'post' gửi dữ liệu; 'put', 'patch' sửa dữ liệu; 'delete' xóa dữ liệu
exports.postProperty = async (req, res, next) => {
  try {
    const {
      name,
      type,
      city,
      address,
      distance,
      title,
      desc,
      cheapestPrice,
      photos,
      featured,
      rooms,
      rate_text,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: name,
          type: type,
          city: city,
          address: address,
          distance: distance,
          title: title,
          desc: desc,
          cheapestPrice: cheapestPrice,
          photos: photos,
          featured: featured,
          rooms: rooms,
          rate_text: rate_text,
        },
        validationErrors: errors.array(),
      });
    }

    const newProperty = await Property.create({
      name,
      type,
      city,
      address,
      distance,
      title,
      desc,
      cheapestPrice,
      photos,
      featured,
      rooms,
      rate_text,
    });

    const savedProperty = await newProperty.save();

    // kiểm tra xem có city chứa property chưa
    await City.find({ title: req.body.city.toLowerCase() }).then(
      async cities => {
        const city = cities[0];
        if (!city) {
          const newCity = new City({
            name: req.body.city,
            title: req.body.city.toLowerCase(),
            photos: [],
            properties: [{ propertyId: savedProperty._id }],
          });
          await newCity.save();
        } else {
          city.properties.push({ propertyId: savedProperty._id });
          await city.save();
        }
      }
    );

    res.status(201).json('created');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getProperties = async (req, res, next) => {
  try {
    await Property.find().then(properties => {
      res.status(200).json({
        message: 'Propertie fetched.',
        items: properties,
      });
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getPropertiesByCity = async (req, res, next) => {
  try {
    const title = req.params.city.replaceAll('-', ' ');
    const city = await City.find({ title: title }).populate({
      path: 'properties.propertyId',
      populate: {
        path: 'rooms.roomId',
        populate: { path: 'roomNumbers.roomNumberId' },
      },
    });
    const properties = [];
    city[0].properties.map(property => properties.push(property.propertyId));

    res.status(200).json({ items: properties });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getPropertiesByType = async (req, res, next) => {
  try {
    const type = req.params.type;
    const properties = await Property.find({ type: type }).populate({
      path: 'rooms.roomId',
      populate: { path: 'roomNumbers.roomNumberId' },
    });

    res.status(200).json({ items: properties });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId).populate({
      path: 'rooms.roomId',
      populate: { path: 'roomNumbers.roomNumberId' },
    });
    res.status(200).json({
      message: 'Fetched reserve successfully.',
      item: property,
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getSearch = async (req, res, next) => {
  const getDateInDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());
    let dates = [];

    while (date <= end) {
      dates.push(new Date(date.getTime()));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  if (
    req.query.destination !== '' ||
    req.query.startDate ||
    req.query.endDate ||
    req.query.min ||
    req.query.max ||
    req.query.adult >= 1 ||
    req.query.children >= 0 ||
    req.query.room >= 1
  ) {
    const destinationSearchValue = req.query.destination;
    const startDateSearchValue = req.query.start_date;
    const endDateSearchValue =
      req.query.end_date === null ? req.query.end_date : req.query.start_date;
    const minSearchValue = req.query.min;
    const maxSearchValue = req.query.max;
    const adultSearchValue = req.query.adult;
    const childrenSearchValue = req.query.children;
    const roomSearchValue = req.query.room;

    try {
      const startDate = new Date(startDateSearchValue);
      const endDate = new Date(endDateSearchValue);
      const allDate = getDateInDateRange(startDate, endDate);

      // kiểm tra city
      const cityIsAvailable = await City.find({
        title: destinationSearchValue.toLowerCase(),
      });

      // kiểm tra property
      const propertyId = cityIsAvailable[0].properties.map(property =>
        property.propertyId.toString()
      );

      const properties = await Property.find({
        cheapestPrice: {
          $gt: Number(minSearchValue) || 1,
          $lt: Number(maxSearchValue) || 999999,
        },
      });

      const roomNumbersIsAvailable = [];
      const roomNumbers = await RoomNumber.find();
      // kiểm tra những phòng còn trống
      roomNumbers.map(roomNumber => {
        const checkRoomNumbers = roomNumber.unavailableDates.some(date =>
          allDate.includes(new Date(date).getTime())
        );
        if (!checkRoomNumbers) {
          roomNumbersIsAvailable.push(roomNumber._id);
        }
      });
      // kiểm tra phòng đủ tiêu chuẩn không
      const rooms = await Room.find({
        maxPeople: {
          $gte: Number(adultSearchValue) + Math.ceil(childrenSearchValue / 2),
        },
      });

      rooms.filter(room => room.roomNumbers.length >= roomSearchValue);

      const roomsIsAvailable = [];
      rooms.map(room => {
        const checkRooms = room.roomNumbers.some(async it =>
          roomNumbersIsAvailable.includes(it.roomNumberId.toString())
        );
        if (checkRooms) {
          roomsIsAvailable.push(room);
        }
      });

      const roomsId = roomsIsAvailable.map(room => room._id.toString());

      const propertyIsAvailable = [];
      properties.map(property => {
        const checkProperties = property.rooms.some(
          room =>
            propertyId.includes(property._id.toString()) &&
            roomsId.includes(room.roomId.toString())
        );
        if (checkProperties) {
          propertyIsAvailable.push(property);
        }
      });

      return res.status(200).json({ roomsIsAvailable, propertyIsAvailable });
    } catch (err) {
      const error = new Error(err);
      return res.status(500).json(error);
    }
  }
};

exports.putProperty = async (req, res, next) => {
  try {
    const {
      name,
      type,
      city,
      address,
      distance,
      title,
      desc,
      cheapestPrice,
      photos,
      featured,
      rooms,
      rate_text,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: name,
          type: type,
          city: city,
          address: address,
          distance: distance,
          title: title,
          desc: desc,
          cheapestPrice: cheapestPrice,
          photos: photos,
          featured: featured,
          rooms: rooms,
          rate_text: rate_text,
        },
        validationErrors: errors.array(),
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProperty);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const { propertyId, cityId } = req.body;
    const deleteProperty = await Property.findById(propertyId);
    const roomId = deleteProperty.rooms.map(room => room.roomId);

    if (roomId.length > 0) {
      const deleteRoom = [];
      for (let i = 0; i < roomId.length; i++) {
        deleteRoom.push(await Room.findById(roomId[i]));
      }
      const roomNumberId = [];
      deleteRoom.map(dr =>
        dr.roomNumbers.map(rnb => roomNumberId.push(rnb.roomNumberId))
      );

      if (roomNumberId.length > 0) {
        roomNumberId.map(async rni => await RoomNumber.findByIdAndDelete(rni));
      }
    }

    try {
      if (roomId.length > 0) {
        roomId.map(async ri => await Room.findByIdAndDelete(ri));
      }
      try {
        const updatedCity = await City.findById(cityId);

        const propertyToRemoveIndex = updatedCity.properties.findIndex(
          property => property.propertyId.toString() === propertyId
        );

        const updatedCityProperties = [...updatedCity.properties];
        updatedCityProperties.splice(propertyToRemoveIndex, 1);
        updatedCity.properties = updatedCityProperties;
        await updatedCity.save();
        try {
          await Property.findByIdAndDelete(propertyId);
        } catch (err) {
          const error = new Error(err);
          return res.status(500).json(error);
        }
      } catch (err) {
        const error = new Error(err);
        return res.status(500).json(error);
      }
    } catch (err) {
      const error = new Error(err);
      return res.status(500).json(error);
    }

    res.status(200).json('Property has been deleted.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};
