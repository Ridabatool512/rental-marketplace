
const express = require("express");
const router = express.Router();

const {
  createReview,
  getListingReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Public: list reviews for a listing
router.get("/listing/:listingId", getListingReviews);

// Protected: review management
router.get("/my", protect, getMyReviews);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
