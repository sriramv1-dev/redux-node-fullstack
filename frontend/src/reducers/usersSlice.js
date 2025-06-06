import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5051/users");

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

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5051/users/addUser", {
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

      console.log(res.json());
      return res.json();
    } catch (error) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:5051/users/${userId}`, {
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

      return res.json();
    } catch (error) {
      return rejectWithValue(error.message || "An unknown error occured");
    }
  }
);

export const addMultipleUsers = createAsyncThunk(
  "users/addMultipleUsers",
  async (users, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5051/users/add-multiple", {
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

      return res.json();
    } catch (error) {
      return rejectWithValue(error.message || "An unknown error occurred");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "idle",
    error: null,
    addUsersStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed' for add operation
    addUsersError: null,

    addUserStatus: "idle",
    addUserError: null,

    deleteUserStatus: "idle",
    deleteUserError: null,
  },
  reducers: {},
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

      // add cases for addMultipleUsers
      .addCase(addMultipleUsers.fulfilled, (state, action) => {
        state.addUsersStatus = "succeeded";
        state.users = state.users.concat(action.payload.users);
      })
      .addCase(addMultipleUsers.rejected, (state, action) => {
        state.addUsersStatus = "rejected";
        state.addUsersError = action.payload || action.error.message;
      })

      // addUser
      .addCase(addUser.fulfilled, (state, action) => {
        state.addUserStatus = "succeeded";
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addUserStatus = "rejected";
        state.addUserError = action.payload || action.error.message;
      })

      // deleteUser
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

// export const {  } = usersSlice.actions;
export default usersSlice.reducer;
