import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || "Failed to fetch users");
      }

      return res.json();
    } catch (error) {
      return rejectWithValue(
        error.message || "An unknown error occurred during user fetch"
      );
    }
  }
);

export const fetchUsersWithPagination = createAsyncThunk(
  "users/fetchUsersWithPagination",
  async (
    { page = 1, limit = 10, searchText = null, sortColumn, sortOrder = "asc" },
    { rejectWithValue }
  ) => {
    try {
      const search = searchText
        ? `&search=${encodeURIComponent(searchText)}`
        : "";

      const sort = sortColumn
        ? `&sortColumn=${sortColumn}&sortOrder=${sortOrder}`
        : "";

      const url = `${API_BASE_URL}/users/paginated?page=${page}&limit=${limit}${search}${sort}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch paginated users"
        );
      }

      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message ||
          "An unknown error occurred during user fetching users with pagination"
      );
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        return rejectWithValue(errorData.message || "Failed to add user");
      }

      const responseData = await res.json();

      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ isActive: false }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData || "Failed to delete the user");
      }

      const responseData = await res.json();

      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || "An unknown error occured");
    }
  }
);

export const addMultipleUsers = createAsyncThunk(
  "users/addMultipleUsers",
  async (users, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/add-multiple`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ users }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        return rejectWithValue(errorData.message || "Failed to add users");
      }

      const responseData = await res.json();

      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    totalUsers: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    sortColumn: "name",
    sortOrder: "asc",
    searchTerm: "",

    status: "idle",
    error: null,
    addUsersStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'rejected' for add operation
    addUsersError: null,

    addUserStatus: "idle",
    addUserError: null,

    deleteUserStatus: "idle",
    deleteUserError: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSort: (state, action) => {
      state.sortColumn = action.payload.sortColumn;
      state.sortOrder = action.payload.sortOrder;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // fetchUsersWithPagination
      .addCase(fetchUsersWithPagination.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsersWithPagination.fulfilled, (state, action) => {
        state.status = "succeeded";

        const {
          data,
          meta: { totalUsers, totalPages, currentPage, itemsPerPage },
        } = action.payload;

        state.users = data;
        state.totalUsers = totalUsers;
        state.totalPages = totalPages;
        state.currentPage = currentPage;
        state.itemsPerPage = itemsPerPage;
      })
      .addCase(fetchUsersWithPagination.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // add cases for addMultipleUsers
      .addCase(addMultipleUsers.pending, (state) => {
        state.addUsersStatus = "loading";
        state.addUsersError = null; // Clear previous errors
      })
      .addCase(addMultipleUsers.fulfilled, (state, action) => {
        state.addUsersStatus = "succeeded";
        state.users = state.users.concat(action.payload.users);
      })
      .addCase(addMultipleUsers.rejected, (state, action) => {
        state.addUsersStatus = "rejected";
        state.addUsersError = action.payload || action.error.message;
      })

      // addUser
      .addCase(addUser.pending, (state) => {
        state.addUserStatus = "loading";
        state.addUserError = null; // Clear previous errors
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.addUserStatus = "succeeded";
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addUserStatus = "rejected";
        state.addUserError = action.payload || action.error.message;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.deleteUserStatus = "loading";
        state.deleteUserError = null; // Clear previous errors
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteUserStatus = "succeeded";
        state.users = state.users.filter(
          (u) => u._id !== action.payload.user._id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteUserStatus = "rejected";
        state.deleteUserError = action.payload || action.error.message;
      });
  },
});

export const { setPage, setItemsPerPage, setSearchTerm, setSort } =
  usersSlice.actions;
export default usersSlice.reducer;
