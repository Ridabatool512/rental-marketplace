
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
  cancelBooking,
  completeBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.get("/received", protect, getReceivedBookings);

router.patch("/:id/status", protect, updateBookingStatus);

router.patch("/:id/cancel", protect, cancelBooking);

router.patch("/:id/complete", protect, completeBooking);

module.exports = router;
