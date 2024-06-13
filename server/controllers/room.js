const Property = require('../models/property');
const Room = require('../models/room');
const RoomNumber = require('../models/roomNumber');
const { validationResult } = require('express-validator');

// 'get' lấy dữ liệu; 'post' gửi dữ liệu; 'put', 'patch' sửa dữ liệu; 'delete' xóa dữ liệu
exports.postRoom = async (req, res, next) => {
  try {
    const { title, desc, price, maxPeople, roomNumbers, propertyId, photos } =
      req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          title: title,
          desc: desc,
          price: price,
          maxPeople: maxPeople,
          roomNumbers: roomNumbers,
          photos: photos,
          propertyId: propertyId,
        },
        validationErrors: errors.array(),
      });
    }

    const newRoom = await Room.create({
      title,
      desc,
      price,
      maxPeople,
      photos,
      propertyId,
    });

    const savedRoom = await newRoom.save();

    try {
      // thêm loại room vào property
      await Property.findByIdAndUpdate(propertyId, {
        $push: { rooms: { roomId: savedRoom._id } },
      });

      // tạo số phòng tường loại room
      roomNumbers.map(async number => {
        const newRoomNumber = await RoomNumber.create({ number });
        const savedRoomNumber = await newRoomNumber.save();
        await Room.findByIdAndUpdate(savedRoom._id, {
          $push: { roomNumbers: { roomNumberId: savedRoomNumber._id } },
        });
      });

      res.status(201).json('created');
    } catch (err) {
      const error = new Error(err);
      return res.status(500).json(error);
    }
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getRooms = async (req, res, next) => {
  try {
    await Room.find().then(rooms => {
      res.status(200).json({
        message: 'Room fetched.',
        items: rooms,
      });
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId).populate(
      'roomNumbers.roomNumberId'
    );

    res.status(200).json({
      message: 'Fetched reserve successfully.',
      item: room,
    });
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.putRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const { title, desc, price, maxPeople, roomNumbers, photos, propertyId } =
      req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          title: title,
          desc: desc,
          price: price,
          maxPeople: maxPeople,
          photos: photos,
          propertyId: propertyId,
        },
        validationErrors: errors.array(),
      });
    }

    const editRoom = await Room.findById(roomId);

    const roomNumberFindByRoomId = [];

    const roomNumberId = editRoom.roomNumbers.map(
      roomNumber => roomNumber.roomNumberId
    );

    for (let i = 0; i < roomNumberId.length; i++) {
      roomNumberFindByRoomId.push(await RoomNumber.findById(roomNumberId[i]));
    }
    // phòng giữ nguyên
    const roomNumberToHold = roomNumbers.map(rns => Number(rns));

    // thêm phòng mới
    const updatedRoomNumber = [];
    for (let i = 0; i < roomNumberToHold.length; i++) {
      const roomNumberToHoldIndex = roomNumberFindByRoomId.findIndex(
        rn => rn.number === roomNumberToHold[i]
      );

      if (roomNumberToHoldIndex < 0) {
        const number = roomNumbers[i];
        const newRoomNumber = await RoomNumber.create({ number });
        const savedRoomNumber = await newRoomNumber.save();
        updatedRoomNumber.push(savedRoomNumber);
      }

      roomNumberToHoldIndex >= 0 &&
        updatedRoomNumber.push(roomNumberFindByRoomId[roomNumberToHoldIndex]);
    }

    // xóa phòng đã bị loại
    const roomNumberToRemove = roomNumberFindByRoomId
      .map(rn => rn.number)
      .filter(item => !roomNumberToHold.includes(item));

    const deleteRoomNumber = [];
    for (let i = 0; i < roomNumberToRemove.length; i++) {
      const roomNumberToRemoveIndex = roomNumberFindByRoomId.findIndex(
        rn => rn.number === roomNumberToRemove[i]
      );

      deleteRoomNumber.push(roomNumberFindByRoomId[roomNumberToRemoveIndex]);
    }

    deleteRoomNumber.map(
      async rno => await RoomNumber.findByIdAndDelete(rno._id)
    );

    await Room.findByIdAndUpdate(roomId, {
      $set: {
        title,
        desc,
        price,
        maxPeople,
        roomNumbers: [],
        propertyId,
        photos,
      },
    });

    updatedRoomNumber.map(
      async urn =>
        await Room.findByIdAndUpdate(roomId, {
          $push: { roomNumbers: { roomNumberId: urn._id } },
        })
    );

    res.status(201).json('updated');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const { roomId, propertyId } = req.body;
    const deleteRoom = await Room.findById(roomId);
    deleteRoom.roomNumbers.map(async drn => {
      await RoomNumber.findByIdAndDelete(drn.roomNumberId);
    });
    try {
      await Room.findByIdAndDelete(roomId);
      try {
        const updatedProperty = await Property.findById(propertyId);
        const roomToRemoveIndex = updatedProperty.rooms.findIndex(
          room => room.roomId.toString() === roomId
        );
        const updatedPropertyRooms = [...updatedProperty.rooms];
        updatedPropertyRooms.splice(roomToRemoveIndex, 1);
        updatedProperty.rooms = updatedPropertyRooms;
        await updatedProperty.save();
      } catch (err) {
        const error = new Error(err);
        return res.status(500).json(error);
      }
    } catch (err) {
      const error = new Error(err);
      return res.status(500).json(error);
    }
    res.status(200).json('Room has been deleted.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};
