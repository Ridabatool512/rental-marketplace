
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  completeBooking,
  markCodPaymentReceived,
} = require("../controllers/bookingController");

const { protect, requireAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.get("/received", protect, getReceivedBookings);

// Admin can view the booking queue, but only the listing owner can decide a booking.
router.get("/admin/all", protect, requireAdmin, getAllBookings);
router.patch("/:id/status", protect, updateBookingStatus);
router.patch("/:id/cod-payment", protect, markCodPaymentReceived);

router.patch("/:id/cancel", protect, cancelBooking);

router.patch("/:id/complete", protect, completeBooking);

module.exports = router;
