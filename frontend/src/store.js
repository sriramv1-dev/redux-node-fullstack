import { configureStore } from "@reduxjs/toolkit";
import BooksReducer from "./reducers/booksSlice";
import UsersReducer from "./reducers/usersSlice";

const store = configureStore({
  reducer: {
    br: BooksReducer,
    ur: UsersReducer,
  },
});

export default store;
