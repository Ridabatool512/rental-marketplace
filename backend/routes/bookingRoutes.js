
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
} = require("../controllers/bookingController");

const { protect, requireAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);

router.get("/my", protect, getMyBookings);

router.get("/received", protect, getReceivedBookings);

// Admin-only booking queue and approval/rejection.
router.get("/admin/all", protect, requireAdmin, getAllBookings);
router.patch("/:id/status", protect, requireAdmin, updateBookingStatus);

router.patch("/:id/cancel", protect, cancelBooking);

router.patch("/:id/complete", protect, completeBooking);

module.exports = router;
