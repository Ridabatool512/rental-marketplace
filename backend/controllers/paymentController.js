
const mongoose = require("mongoose");
const crypto = require("crypto");

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// Create a demo payment and update the booking atomically
const createDemoPayment = async (req, res) => {
  const { bookingId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({
      message: "A valid bookingId is required.",
    });
  }

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const booking = await Booking.findById(bookingId).session(session);

      if (!booking) {
        result = {
          status: 404,
          body: { message: "Booking not found." },
        };
        return;
      }

      if (booking.renter.toString() !== req.user.id) {
        result = {
          status: 403,
          body: { message: "You can only pay for your own bookings." },
        };
        return;
      }

      if (booking.paymentMethod !== "online") {
        result = {
          status: 400,
          body: { message: "This booking uses Cash on Delivery, not online payment." },
        };
        return;
      }

      if (booking.status !== "approved") {
        result = {
          status: 400,
          body: { message: "Only approved bookings can be paid for." },
        };
        return;
      }

      const existingPayment = await Payment.findOne({
        booking: booking._id,
      }).session(session);

      if (existingPayment) {
        result = {
          status: 409,
          body: {
            message: "A payment record already exists for this booking.",
            payment: existingPayment,
          },
        };
        return;
      }

      if (booking.paymentStatus !== "unpaid") {
        result = {
          status: 409,
          body: {
            message: "This booking is not available for a new payment.",
          },
        };
        return;
      }

      const transactionReference = `DEMO-${crypto.randomUUID()}`;

      const [payment] = await Payment.create(
        [
          {
            booking: booking._id,
            renter: booking.renter,
            owner: booking.owner,
            amount: booking.totalPrice,
            currency: "PKR",
            method: "demo",
            provider: "demo",
            status: "pending",
            transactionReference,
          },
        ],
        { session }
      );

      booking.paymentStatus = "pending";
      await booking.save({ session });

      result = {
        status: 201,
        body: {
          message:
            "Demo payment created. No real money has been charged.",
          payment,
          demoOnly: true,
        },
      };
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Create demo payment error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A payment record already exists for this booking.",
      });
    }

    return res.status(500).json({
      message: "Unable to create demo payment.",
    });
  } finally {
    await session.endSession();
  }
};

// Simulate success or failure and update both records atomically
const simulateDemoPayment = async (req, res) => {
  const { id } = req.params;
  const { outcome } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid payment ID.",
    });
  }

  if (!["success", "failure"].includes(outcome)) {
    return res.status(400).json({
      message: 'Outcome must be "success" or "failure".',
    });
  }

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const payment = await Payment.findById(id).session(session);

      if (!payment) {
        result = {
          status: 404,
          body: { message: "Payment not found." },
        };
        return;
      }

      if (payment.renter.toString() !== req.user.id) {
        result = {
          status: 403,
          body: {
            message: "You can only simulate your own payments.",
          },
        };
        return;
      }

      if (payment.provider !== "demo" || payment.method !== "demo") {
        result = {
          status: 400,
          body: { message: "This endpoint only supports demo payments." },
        };
        return;
      }

      if (payment.status !== "pending") {
        result = {
          status: 400,
          body: { message: "Only pending payments can be simulated." },
        };
        return;
      }

      const booking = await Booking.findById(payment.booking).session(session);

      if (!booking) {
        result = {
          status: 404,
          body: { message: "Associated booking not found." },
        };
        return;
      }

      if (booking.paymentStatus !== "pending") {
        result = {
          status: 409,
          body: {
            message: "Booking payment status is inconsistent. Please investigate.",
          },
        };
        return;
      }

      const newStatus = outcome === "success" ? "succeeded" : "failed";

      // Only one request can process a pending payment.
      const updatedPayment = await Payment.findOneAndUpdate(
        {
          _id: payment._id,
          renter: req.user.id,
          provider: "demo",
          status: "pending",
        },
        {
          $set: {
            status: newStatus,
            failureReason:
              outcome === "failure"
                ? "Simulated demo payment failure."
                : null,
            paidAt: outcome === "success" ? new Date() : null,
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!updatedPayment) {
        result = {
          status: 409,
          body: {
            message: "Payment was already processed. Please refresh.",
          },
        };
        return;
      }

      booking.paymentStatus =
        outcome === "success" ? "paid" : "failed";

      await booking.save({ session });

      result = {
        status: 200,
        body: {
          message:
            outcome === "success"
              ? "Demo payment succeeded. No real money was transferred."
              : "Demo payment failed. No real money was charged.",
          payment: updatedPayment,
          bookingPaymentStatus: booking.paymentStatus,
          demoOnly: true,
        },
      };
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Simulate demo payment error:", error.message);

    return res.status(500).json({
      message: "Unable to simulate demo payment.",
    });
  } finally {
    await session.endSession();
  }
};

// Get payment history for the renter
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ renter: req.user.id })
      .populate(
        "booking",
        "startDate endDate totalDays totalPrice status paymentStatus"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get my payments error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve payment history.",
    });
  }
};

// Get payments associated with the owner's listings
const getReceivedPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ owner: req.user.id })
      .populate(
        "booking",
        "startDate endDate totalDays totalPrice status paymentStatus"
      )
      .populate("renter", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get received payments error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve received payments.",
    });
  }
};

module.exports = {
  createDemoPayment,
  simulateDemoPayment,
  getMyPayments,
  getReceivedPayments,
};
