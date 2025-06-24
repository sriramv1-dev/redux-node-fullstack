const User = require("../models/userModel");
const AppError = require("../utils/appError");

const findUsers = async (filter = {}, options = {}) => {
  try {
    return await User.find(filter, null, options);
  } catch (error) {
    throw new AppError("Error fetching users", 500);
  }
};

const countUsers = async (filter = {}) => {
  try {
    return await User.countDocuments(filter);
  } catch (error) {
    throw new AppError("Error counting users", 500);
  }
};

const findUserByIdAndUpdate = async (id, updates, options) => {
  try {
    return await User.findAndUpdate(id, updates, options);
  } catch (error) {
    throw new AppError("Error counting users", 500);
  }
};

const insertUser = async (user) => {
  try {
    return await User.create(user);
  } catch (error) {
    throw new AppError("Error inserting user", 500);
  }
};

const insertUsers = async (users) => {
  try {
    return await User.insertMany(users);
  } catch (error) {
    throw new AppError("Error inserting users", 500);
  }
};

module.exports = {
  countUsers,
  findUsers,
  findUserByIdAndUpdate,
  insertUser,
  insertUsers,
};
