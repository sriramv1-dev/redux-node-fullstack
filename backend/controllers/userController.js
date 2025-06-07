const User = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    // Since we didn't have isActiveProperty on the existing records, we have to take that into consideration:

    // const users = await User.find({ isActive: true });
    const users = await User.find({
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

const getAllUsersWithPagination = async (req, res) => {
  try {
    //  Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const sortColumn = req.query.sortColumn?.trim() || "";
    const sortOrder = req.query.sortOrder?.trim() || "asc";

    // calculate the number of documents to skip:
    const skip = (page - 1) * limit;

    //create the filter
    const baseFilter = {
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    };

    let filter;

    if (search) {
      const searchRegex = new RegExp(search, "i"); // i: case insensitive
      filter = {
        $and: [
          baseFilter,
          {
            $or: [
              { name: searchRegex },
              { email: searchRegex },
              { username: searchRegex },
              { "address.city": searchRegex },
            ],
          },
        ],
      };
    } else {
      filter = baseFilter;
    }

    // get total users count
    const totalUsers = await User.countDocuments(filter);

    // Fetch the users for the current page

    const allowedSortColumns = [
      "name",
      "email",
      "username",
      "address.city",
      "createdAt",
    ];

    let sColumn = sortColumn;
    if (!allowedSortColumns.includes(sortColumn)) {
      sColumn = "createdAt";
    }

    const paginatedUsers = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sColumn]: sortOrder === "asc" ? 1 : -1 });

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Return the paginated data with total counts
    return res.status(200).json({
      users: paginatedUsers,
      meta: {
        totalUsers,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("getAllUsersWithPagination", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Request body must be a non-empty userId",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: { ...updatedFields, updatedAt: Date.now() },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User soft-deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
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
  updateUser,
  getAllUsers,
  getAllUsersWithPagination,
};
