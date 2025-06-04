const mongoose = require("mongoose");

// Define the Geo schema for latitude and longitude
const GeoSchema = new mongoose.Schema(
  {
    lat: {
      type: String, // Storing as String as per the example data
      // required: true,
    },
    lng: {
      type: String, // Storing as String as per the example data
      // required: true,
    },
  },
  { _id: false }
); // _id: false prevents Mongoose from adding a default _id to subdocuments

// Define the Address schema
const AddressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: true,
    },
    suite: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipcode: {
      type: String,
      required: true,
    },
    geo: {
      type: GeoSchema, // Nested GeoSchema
      // required: true,
    },
  },
  { _id: false }
); // _id: false prevents Mongoose from adding a default _id to subdocuments

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    catchPhrase: {
      type: String,
      // required: true,
    },
    bs: {
      type: String,
      // required: true,
    },
  },
  { _id: false }
); // _id: false prevents Mongoose from adding a default _id to subdocuments

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true, // Usernames should typically be unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // Emails should typically be unique
      match: /^\S+@\S+\.\S+$/, // Basic email format validation
    },
    address: {
      type: AddressSchema, // Nested AddressSchema
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    website: {
      type: String,
      // required: true,
    },
    company: {
      type: CompanySchema, // Nested CompanySchema
      // required: true,
    },
  },
  {
    timestamps: true, // Mongoose will automatically add `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("User", UserSchema);
