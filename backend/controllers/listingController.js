
const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const Store = require("../models/Store");

const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      images,
      condition,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
      location,
      storeId,
      quantity = 1,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof location !== "string" ||
      !location.trim() ||
      pricePerDay === undefined ||
      pricePerDay === null ||
      pricePerDay === ""
    ) {
      return res.status(400).json({
        message:
          "Title, description, category, location, store, and daily price are required.",
      });
    }

    if (
      title.trim().length > 120 ||
      description.trim().length > 3000
    ) {
      return res.status(400).json({
        message: "Title or description exceeds the allowed length.",
      });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only add listings to your own store." });
    }

    const stockQuantity = Number(quantity);

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      return res.status(400).json({ message: "Quantity must be a whole number of zero or more." });
    }

    const dailyPrice = Number(pricePerDay);

    if (!Number.isFinite(dailyPrice) || dailyPrice < 1) {
      return res.status(400).json({
        message: "Daily price must be a number greater than zero.",
      });
    }

    const optionalPrices = {
      pricePerWeek,
      pricePerMonth,
    };

    for (const [field, value] of Object.entries(optionalPrices)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        (!Number.isFinite(Number(value)) || Number(value) < 1)
      ) {
        return res.status(400).json({
          message: `${field} must be a number greater than zero.`,
        });
      }
    }

    if (
      images !== undefined &&
      (!Array.isArray(images) ||
        !images.every((image) => typeof image === "string"))
    ) {
      return res.status(400).json({
        message: "Images must be an array of image URLs.",
      });
    }

    const listing = await Listing.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim().toLowerCase(),
      images: images || [],
      condition: condition || "good",
      pricePerDay: dailyPrice,
      ...(pricePerWeek !== undefined &&
        pricePerWeek !== "" && {
          pricePerWeek: Number(pricePerWeek),
        }),
      ...(pricePerMonth !== undefined &&
        pricePerMonth !== "" && {
          pricePerMonth: Number(pricePerMonth),
        }),
      location: location.trim(),
      quantity: stockQuantity,
      status: stockQuantity === 0 ? "rented" : "available",
      owner: req.user.id,
      store: store._id,
    });

    return res.status(201).json({
      message: "Rental listing created successfully.",
      listing,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid listing data.",
        error: error.message,
      });
    }

    console.error("Create listing error:", error.message);

    return res.status(500).json({
      message: "Failed to create listing.",
    });
  }
};

const getListings = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    // Keep sold-out listings visible in the marketplace with an Out of Stock label.
    // Manually paused listings (status: unavailable) remain hidden.
    const filter = { status: { $in: ["available", "rented"] } };

    if (category) {
      filter.category = category.trim().toLowerCase();
    }

    if (location) {
      const escapedLocation = location.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.location = {
        $regex: escapedLocation,
        $options: "i",
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.pricePerDay = {};

      if (minPrice !== undefined) {
        const min = Number(minPrice);

        if (!Number.isFinite(min) || min < 0) {
          return res.status(400).json({
            message: "Minimum price must be a valid non-negative number.",
          });
        }

        filter.pricePerDay.$gte = min;
      }

      if (maxPrice !== undefined) {
        const max = Number(maxPrice);

        if (!Number.isFinite(max) || max < 0) {
          return res.status(400).json({
            message: "Maximum price must be a valid non-negative number.",
          });
        }

        filter.pricePerDay.$lte = max;
      }

      if (
        filter.pricePerDay.$gte !== undefined &&
        filter.pricePerDay.$lte !== undefined &&
        filter.pricePerDay.$gte > filter.pricePerDay.$lte
      ) {
        return res.status(400).json({
          message: "Minimum price cannot exceed maximum price.",
        });
      }
    }

    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const requestedPage = Number(page);
    const requestedLimit = Number(limit);

    if (
      !Number.isInteger(requestedPage) ||
      requestedPage < 1 ||
      !Number.isInteger(requestedLimit) ||
      requestedLimit < 1
    ) {
      return res.status(400).json({
        message: "Page and limit must be positive integers.",
      });
    }

    const pageNumber = requestedPage;
    const pageSize = Math.min(50, requestedLimit);

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("owner", "name")
        .populate("store", "name category location coverImage")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Listing.countDocuments(filter),
    ]);

    return res.status(200).json({
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      listings,
    });
  } catch (error) {
    console.error("Get listings error:", error.message);

    if (error.code === 27 || error.codeName === "IndexNotFound") {
      return res.status(400).json({
        message:
          "Search indexing is unavailable. Please try without the search term.",
      });
    }

    return res.status(500).json({
      message: "Failed to fetch listings.",
    });
  }
};


const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user.id })
      .populate("owner", "name")
      .populate("store", "name category location coverImage")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      total: listings.length,
      listings,
    });
  } catch (error) {
    console.error("Get my listings error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch your listings.",
    });
  }
};

const getListingById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid listing ID.",
      });
    }

    const listing = await Listing.findById(req.params.id)
      .populate("owner", "name")
      .populate("store", "name category location coverImage")
      .lean();

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found.",
      });
    }

    return res.status(200).json({ listing });
  } catch (error) {
    console.error("Get listing by ID error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch listing.",
    });
  }
};

const updateListing = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid listing ID.",
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found.",
      });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own listings.",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "images",
      "condition",
      "pricePerDay",
      "pricePerWeek",
      "pricePerMonth",
      "location",
      "status",
      "quantity",
    ];

    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "One or more fields cannot be updated.",
        fields: invalidFields,
      });
    }

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (
          ["title", "description", "category", "location"].includes(field) &&
          (typeof req.body[field] !== "string" ||
            !req.body[field].trim())
        ) {
          return res.status(400).json({
            message: `${field} must be a non-empty string.`,
          });
        }

        if (field === "quantity") {
          const quantity = Number(req.body.quantity);
          if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({ message: "Quantity must be a whole number of zero or more." });
          }
          listing.quantity = quantity;
          continue;
        }

        if (
          ["pricePerDay", "pricePerWeek", "pricePerMonth"].includes(field)
        ) {
          const price = Number(req.body[field]);

          if (
            req.body[field] === "" ||
            !Number.isFinite(price) ||
            price < 1
          ) {
            return res.status(400).json({
              message: `${field} must be a number greater than zero.`,
            });
          }

          listing.set(field, price);
          continue;
        }

        if (
          field === "images" &&
          (!Array.isArray(req.body.images) ||
            !req.body.images.every((image) => typeof image === "string"))
        ) {
          return res.status(400).json({
            message: "Images must be an array of image URLs.",
          });
        }

        if (field === "category") {
          listing.set(field, req.body[field].trim().toLowerCase());
        } else if (
          ["title", "description", "location"].includes(field)
        ) {
          listing.set(field, req.body[field].trim());
        } else {
          listing.set(field, req.body[field]);
        }
      }
    }

    // Zero stock always means out of stock. Increasing stock re-enables a previously sold-out listing,
    // unless the owner explicitly keeps it unavailable.
    if (listing.quantity <= 0) {
      listing.status = "rented";
    } else if (listing.status === "rented") {
      listing.status = req.body.status === "unavailable" ? "unavailable" : "available";
    }

    await listing.save();

    return res.status(200).json({
      message: "Listing updated successfully.",
      listing,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid listing data.",
        error: error.message,
      });
    }

    console.error("Update listing error:", error.message);

    return res.status(500).json({
      message: "Failed to update listing.",
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid listing ID.",
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found.",
      });
    }

    if (listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own listings.",
      });
    }

    await listing.deleteOne();

    return res.status(200).json({
      message: "Listing deleted successfully.",
    });
  } catch (error) {
    console.error("Delete listing error:", error.message);

    return res.status(500).json({
      message: "Failed to delete listing.",
    });
  }
};

module.exports = {
  createListing,
  getListings,
  getMyListings,
  getListingById,
  updateListing,
  deleteListing,
};
