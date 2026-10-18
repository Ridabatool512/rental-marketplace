
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const storeRoutes = require("./routes/storeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get("/", (req, res) => {
  res.json({
    message: "Rental System API is running successfully!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is working",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/reviews", reviewRoutes);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
