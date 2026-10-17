
const express = require("express");
const router = express.Router();

const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} = require("../controllers/listingController");

const { protect } = require("../middleware/authMiddleware");

// Get all available listings
router.get("/", getListings);

// Create a listing (login required)
router.post("/", protect, createListing);

// Get one listing
router.get("/:id", getListingById);

// Update a listing (owner only)
router.put("/:id", protect, updateListing);
router.patch("/:id", protect, updateListing);

// Delete a listing (owner only)
router.delete("/:id", protect, deleteListing);

module.exports = router;
