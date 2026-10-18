
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

const parseDate = (value) => {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
};

// Create a booking request
const createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate, phone, address, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(listingId || "")) {
      return res.status(400).json({
        message: "A valid listing ID is required.",
      });
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end) {
      return res.status(400).json({
        message: "Dates must use YYYY-MM-DD format.",
      });
    }

    if (
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof address !== "string" ||
      !address.trim()
    ) {
      return res.status(400).json({
        message: "A contact phone number and delivery address are required.",
      });
    }

    if (phone.trim().length > 40 || address.trim().length > 500 ||
      (notes !== undefined && (typeof notes !== "string" || notes.length > 1000))) {
      return res.status(400).json({
        message: "Contact details are too long or invalid.",
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        message: "The rental start date cannot be in the past.",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "The end date must be after the start date.",
      });
    }

    const totalDays = Math.round(
      (end.getTime() - start.getTime()) / 86400000
    );

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found.",
      });
    }

    if (listing.status !== "available") {
      return res.status(400).json({
        message: "This listing is not available for booking.",
      });
    }

    if (listing.owner.toString() === req.user.id) {
      return res.status(403).json({
        message: "You cannot book your own listing.",
      });
    }

    // Pending requests do not reserve the item. Multiple customers can
    // checkout and send requests; the admin approves only one overlapping request.
    const existingBooking = await Booking.findOne({
      listing: listing._id,
      status: "approved",
      startDate: { $lt: end },
      endDate: { $gt: start },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "These dates overlap with an already approved booking.",
      });
    }

    const pricePerDay = Number(listing.pricePerDay);
    const totalPrice = pricePerDay * totalDays;

    const booking = await Booking.create({
      listing: listing._id,
      renter: req.user.id,
      owner: listing.owner,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay,
      totalPrice,
      contactPhone: phone.trim(),
      deliveryAddress: address.trim(),
      notes: typeof notes === "string" ? notes.trim() : "",
      status: "pending",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("listing", "title category images location")
      .populate("renter", "name email")
      .populate("owner", "name email");

    return res.status(201).json({
      message: "Booking request created successfully.",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error.message);

    return res.status(500).json({
      message: "Unable to create booking.",
    });
  }
};

// View bookings made by the logged-in renter
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      renter: req.user.id,
    })
      .populate("listing", "title category images location pricePerDay")
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve your bookings.",
    });
  }
};

// View booking requests received by the logged-in owner
const getReceivedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      owner: req.user.id,
    })
      .populate("listing", "title category images location pricePerDay")
      .populate("renter", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get received bookings error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve received bookings.",
    });
  }
};



// Admin: view all booking requests from every customer and listing owner.
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("listing", "title category images location pricePerDay")
      .populate("renter", "name email")
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve bookings.",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid booking ID.",
    });
  }

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({
      message: "Status must be approved or rejected.",
    });
  }

  const session = await mongoose.startSession();

  try {
    let responseStatus = 200;
    let responseBody = null;

    await session.withTransaction(
      async () => {
        responseStatus = 200;
        responseBody = null;

        const booking = await Booking.findById(id).session(session);

        if (!booking) {
          responseStatus = 404;
          responseBody = { message: "Booking not found." };
          return;
        }

        if (req.user.role !== "admin") {
          responseStatus = 403;
          responseBody = {
            message: "Only an admin can approve or reject bookings.",
          };
          return;
        }

        if (booking.status !== "pending") {
          responseStatus = 400;
          responseBody = {
            message: "Only pending bookings can be approved or rejected.",
          };
          return;
        }

        if (status === "approved") {
          const listing = await Listing.findById(booking.listing)
            .session(session);

          if (!listing || listing.status !== "available") {
            responseStatus = 409;
            responseBody = {
              message: "This listing is no longer available.",
            };
            return;
          }

          // Make a real write to the listing inside this transaction.
          // Concurrent approvals for the same listing can then conflict.
          const lockResult = await Listing.updateOne(
            {
              _id: listing._id,
              status: "available",
            },
            {
              $inc: { __v: 1 },
            },
            { session }
          );

          if (lockResult.matchedCount !== 1) {
            throw new Error("BOOKING_RETRY_CONFLICT");
          }

          // Recheck approved bookings within the transaction.
          const conflict = await Booking.findOne({
            _id: { $ne: booking._id },
            listing: booking.listing,
            status: "approved",
            startDate: { $lt: booking.endDate },
            endDate: { $gt: booking.startDate },
          }).session(session);

          if (conflict) {
            responseStatus = 409;
            responseBody = {
              message: "Another approved booking overlaps these dates.",
            };
            return;
          }
        }

        booking.status = status;
        await booking.save({ session });

        responseBody = {
          message: `Booking ${status} successfully.`,
          bookingId: booking._id.toString(),
        };
      },
      {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
        readPreference: "primary",
      }
    );

    if (responseStatus !== 200) {
      return res.status(responseStatus).json(responseBody);
    }

    const populatedBooking = await Booking.findById(responseBody.bookingId)
      .populate("listing", "title category images location")
      .populate("renter", "name email")
      .populate("owner", "name email");

    return res.status(200).json({
      message: responseBody.message,
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error.message);

    if (
      error.hasErrorLabel?.("TransientTransactionError") ||
      error.hasErrorLabel?.("UnknownTransactionCommitResult") ||
      error.message === "BOOKING_RETRY_CONFLICT"
    ) {
      return res.status(409).json({
        message:
          "A booking update conflicted with another operation. Please retry.",
      });
    }

    return res.status(500).json({
      message: "Unable to update booking status.",
    });
  } finally {
    await session.endSession();
  }
};

// Renter cancels their booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.renter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the renter can cancel this booking.",
      });
    }

    if (!["pending", "approved"].includes(booking.status)) {
      return res.status(400).json({
        message: "This booking cannot be cancelled.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully.",
      booking,
    });
  
  } catch (error) {
    console.error("Cancel booking error:", error.message);

    return res.status(500).json({
      message: "Unable to cancel booking.",
    });
  }
};

// Complete a paid booking after its end date
const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    if (booking.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only the listing owner can complete this booking.",
      });
    }

    if (booking.status !== "approved") {
      return res.status(400).json({
        message: "Only approved bookings can be completed.",
      });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "The booking must be paid before completion.",
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (booking.endDate >= today) {
      return res.status(400).json({
        message: "A booking can only be completed after its end date.",
      });
    }

    booking.status = "completed";
    await booking.save();

    return res.status(200).json({
      message: "Booking completed successfully.",
      booking,
    });
  } catch (error) {
    console.error("Complete booking error:", error.message);

    return res.status(500).json({
      message: "Unable to complete booking.",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  completeBooking,
};
