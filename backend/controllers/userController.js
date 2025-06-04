const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const user = req.body.user;

    if (!user) {
      return res.status(400).json({
        message: "Request body must be a non-empty user",
      });
    }

    const insertedUser = await User.create(user);

    return res.status(201).json({
      message: "User added successfully",
      users: insertedUser,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Duplicate key error: A user with the provided username or email already exists.",
        error: error.message,
      });
    }

    res
      .status(500)
      .json({ message: "Failed to add single user", error: error.message });
  }
};

const addBulkUsers = async (req, res) => {
  try {
    const users = req.body.users;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        message: "Request body must be a non-empty array of user objects.",
      });
    }

    const insertedUsers = await User.insertMany(users);

    return res.status(201).json({
      message: "Users added successfully",
      count: insertedUsers.length,
      users: insertedUsers,
    });
  } catch (error) {
    console.error("Error inserting users:", error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "Duplicate key error: A user with the provided username or email already exists.",
        error: error.message,
      });
    }

    res
      .status(500)
      .json({ message: "Failed to add multiple users", error: error.message });
  }
};

module.exports = {
  addBulkUsers,
  addUser,
  getAllUsers,
};
