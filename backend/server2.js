const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://another-allowed-site.com",
];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    exposedHeaders: ["X-CSRF-Token"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
//app.use("/api", authMiddleware, dataRoutes); // All API routes require auth
app.use("/api", authMiddleware, dataRoutes); // All API routes require auth
app.use("/social", authMiddleware, socialMediaRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
