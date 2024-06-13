import User from '../models/user';

// 'get' lấy dữ liệu; 'post' gửi dữ liệu; 'put', 'patch' sửa dữ liệu; 'delete' xóa dữ liệu
exports.putUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted.');
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    const error = new Error(err);
    return res.status(500).json(error);
  }
};
