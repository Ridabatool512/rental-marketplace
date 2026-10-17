
const mongoose = require("mongoose");
const Store = require("../models/Store");

const createStore = async (req, res) => {
  try {
    const { name, description, location } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof location !== "string" ||
      !location.trim()
    ) {
      return res.status(400).json({
        message: "Store name and location are required",
      });
    }

    const store = await Store.create({
      name: name.trim(),
      description:
        typeof description === "string" ? description.trim() : "",
      location: location.trim(),
      owner: req.user.id,
    });

    return res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    console.error("Create store error:", error.message);
    return res.status(500).json({
      message: "Server error while creating store",
    });
  }
};

const getStores = async (req, res) => {
  try {
    const stores = await Store.find()
      .populate("owner", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      total: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Get stores error:", error.message);
    return res.status(500).json({
      message: "Server error while fetching stores",
    });
  }
};

const getMyStores = async (req, res) => {
  try {
    const stores = await Store.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      total: stores.length,
      stores,
    });
  } catch (error) {
    console.error("Get my stores error:", error.message);
    return res.status(500).json({
      message: "Server error while fetching your stores",
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid store ID",
      });
    }

    const store = await Store.findById(req.params.id)
      .populate("owner", "name");

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    return res.status(200).json({ store });
  } catch (error) {
    console.error("Get store error:", error.message);
    return res.status(500).json({
      message: "Server error while fetching store",
    });
  }
};

const updateStore = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid store ID",
      });
    }

    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own stores",
      });
    }

    const allowedFields = ["name", "description", "location"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== "string") {
          return res.status(400).json({
            message: `${field} must be a string`,
          });
        }

        if (
          ["name", "location"].includes(field) &&
          !req.body[field].trim()
        ) {
          return res.status(400).json({
            message: `${field} cannot be empty`,
          });
        }

        store[field] = req.body[field].trim();
      }
    }

    await store.save();

    return res.status(200).json({
      message: "Store updated successfully",
      store,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Update store error:", error.message);
    return res.status(500).json({
      message: "Server error while updating store",
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid store ID",
      });
    }

    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own stores",
      });
    }

    await store.deleteOne();

    return res.status(200).json({
      message: "Store deleted successfully",
    });
  } catch (error) {
    console.error("Delete store error:", error.message);
    return res.status(500).json({
      message: "Server error while deleting store",
    });
  }
};

module.exports = {
  createStore,
  getStores,
  getMyStores,
  getStoreById,
  updateStore,
  deleteStore,
};
