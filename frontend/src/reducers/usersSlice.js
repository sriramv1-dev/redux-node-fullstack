import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
//   const res = await fetch("https://jsonplaceholder.typicode.com/users");

//   if (!res.ok) {
//     throw new Error("Unable to fetch users");
//   }

//   return res.json();
// });

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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log(action);
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })

      // add cases for addMultipleUsers
      .addCase(addMultipleUsers.fulfilled, (state, action) => {
        console.log(action);
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
      });
  },
});

// export const {  } = usersSlice.actions;
export default usersSlice.reducer;
