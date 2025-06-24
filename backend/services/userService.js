const userRepo = require("../repositories/userRepository");
const AppError = require("../utils/appError");

const getAllUsers = async () => {
  const filter = {
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  };
  return await userRepo.findUsers(filter);
};

const getUsersWithPagination = async (params) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortColumn,
      sortOrder = "asc",
    } = params;

    const skip = (page - 1) * limit;

    const baseFilter = {
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    };

    let filter = baseFilter;
    if (search) {
      const regex = new RegExp(search, "i");
      filter = {
        $and: [
          baseFilter,
          {
            $or: [
              { name: regex },
              { username: regex },
              { email: regex },
              { "address.city": regex },
            ],
          },
        ],
      };
    }

    const totalUsers = await userRepo.countUsers(filter);
    const allowedSortColumns = [
      "name",
      "email",
      "username",
      "address.city",
      "createdAt",
    ];
    let sColumn = sortColumn;

    if (!allowedSortColumns.includes(sColumn)) {
      sColumn = "createdAt";
    }
    const users = await userRepo.findUsers(filter, {
      skip,
      limit,
      sort: { [sortColumn]: sortOrder === "asc" ? 1 : -1 },
    });

    return {
      users,
      meta: {
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    throw new AppError("Error fetching", 500);
  }
};

module.exports = { getAllUsers, getUsersWithPagination };
