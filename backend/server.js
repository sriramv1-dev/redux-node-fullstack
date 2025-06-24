const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5051;

// --- Dynamically set CORS origin based on environment ---
let allowedOrigin;
if (process.env.NODE_ENV === "production") {
  // In production, this should be the URL of your deployed React frontend (CloudFront URL)
  // or your custom domain for the frontend.
  allowedOrigin = process.env.FRONTEND_URL;
  console.log("CORS origin (Production):", allowedOrigin);
} else {
  // For development
  allowedOrigin = process.env.DEV_FRONTEND_URL || "http://localhost:3000";
  console.log("CORS origin (Development):", allowedOrigin);
}

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  next();
});

// --- MongoDB Connection ---
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error(
    "CRITICAL: MONGODB_URI is not defined in environment variables!"
  );
  // In a traditional server, you might exit.
  // For Lambda, the process will exit automatically if the handler can't initialize.
  // For robustness, you might want to throw an error here, which Lambda would catch.
  throw new Error("MONGODB_URI environment variable is missing.");
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err)); // Log connection errors

app.use("/users", userRoutes);

// --- Export the Express app instance ---
// This is crucial for Lambda. We DO NOT call app.listen() here.
module.exports = app;

// --- ONLY for local development with `node server.js` ---
// This block will only run if the file is executed directly (e.g., `node server.js`)
// and not when imported by the Lambda handler or test files.
if (process.env.NODE_ENV !== "production") {
  // Or process.env.IS_LOCAL === 'true'
  const PORT = process.env.PORT || 5051;
  app.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
    );
    console.log(`Local MongoDB URI: ${process.env.MONGODB_URI}`); // For debugging
  });
}
