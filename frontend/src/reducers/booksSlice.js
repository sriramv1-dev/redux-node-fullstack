import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const booksSlice = createSlice({
  name: "books",
  initialState: [],
  reducers: {
    getBooks: (state, action) => {},
  },
});

export const { getBooks } = booksSlice.actions;
export default booksSlice.reducer;
