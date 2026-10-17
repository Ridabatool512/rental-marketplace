
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

// Create a review for a completed booking
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId || "")) {
      return res.status(400).json({
        message: "A valid booking ID is required.",
      });
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be a whole number from 1 to 5.",
      });
    }

    if (typeof comment !== "string" || comment.length > 1000) {
      return res.status(400).json({
        message: "Comment must be text with at most 1000 characters.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.renter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the renter can review this booking.",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "You can review a booking only after it is completed.",
      });
    }

    const listing = await Listing.findById(booking.listing);

    if (!listing) {
      return res.status(404).json({
        message: "The listing associated with this booking was not found.",
      });
    }

    const review = await Review.create({
      listing: booking.listing,
      booking: booking._id,
      renter: req.user.id,
      rating,
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(review._id)
      .populate("renter", "name")
      .lean();

    return res.status(201).json({
      message: "Review submitted successfully.",
      review: populatedReview,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this booking.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Create review error:", error.message);

    return res.status(500).json({
      message: "Unable to submit review.",
    });
  }
};

// Get reviews and rating summary for a listing
const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        message: "Invalid listing ID.",
      });
    }

    const listingExists = await Listing.exists({ _id: listingId });

    if (!listingExists) {
      return res.status(404).json({
        message: "Listing not found.",
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const [reviews, total, summary] = await Promise.all([
      Review.find({ listing: listingId })
        .populate("renter", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Review.countDocuments({ listing: listingId }),

      Review.aggregate([
        { $match: { listing: new mongoose.Types.ObjectId(listingId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      listingId,
      averageRating: summary.length
        ? Math.round(summary[0].averageRating * 10) / 10
        : 0,
      totalReviews: total,
      page,
      totalPages: Math.ceil(total / limit),
      reviews,
    });
  } catch (error) {
    console.error("Get listing reviews error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve listing reviews.",
    });
  }
};

// Get reviews written by the logged-in renter
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ renter: req.user.id })
      .populate("listing", "title images location")
      .populate("booking", "startDate endDate status")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get my reviews error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve your reviews.",
    });
  }
};

// Edit a review written by the logged-in renter
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID.",
      });
    }

    if (
      rating !== undefined &&
      (!Number.isInteger(rating) || rating < 1 || rating > 5)
    ) {
      return res.status(400).json({
        message: "Rating must be a whole number from 1 to 5.",
      });
    }

    if (
      comment !== undefined &&
      (typeof comment !== "string" || comment.length > 1000)
    ) {
      return res.status(400).json({
        message: "Comment must be text with at most 1000 characters.",
      });
    }

    if (rating === undefined && comment === undefined) {
      return res.status(400).json({
        message: "Provide a rating or comment to update.",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (review.renter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own reviews.",
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment.trim();

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate("renter", "name")
      .lean();

    return res.status(200).json({
      message: "Review updated successfully.",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error.message);

    return res.status(500).json({
      message: "Unable to update review.",
    });
  }
};


 // Delete a review written by the logged-in renter
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (review.renter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own reviews.",
      });
    }

    await review.deleteOne();

    return res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error.message);

    return res.status(500).json({
      message: "Unable to delete review.",
    });
  }
};

module.exports = {
  createReview,
  getListingReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};
