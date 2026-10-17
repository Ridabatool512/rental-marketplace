
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      enum: ["PKR"],
      default: "PKR",
    },

    method: {
      type: String,
      enum: ["demo"],
      default: "demo",
    },

    provider: {
      type: String,
      enum: ["demo"],
      default: "demo",
    },

    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },

    transactionReference: {
      type: String,
      required: true,
      unique: true,
    },

    failureReason: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ booking: 1 }, { unique: true });
paymentSchema.index({ renter: 1, createdAt: -1 });
paymentSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
