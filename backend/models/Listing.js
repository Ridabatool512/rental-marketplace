
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    images: {
      type: [String],
      default: [],
    },

    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair"],
      default: "good",
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerWeek: {
      type: Number,
      min: 1,
    },

    pricePerMonth: {
      type: Number,
      min: 1,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: false,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number.",
      },
    },

    status: {
      type: String,
      enum: ["available", "unavailable", "rented"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

module.exports = mongoose.model("Listing", listingSchema);
