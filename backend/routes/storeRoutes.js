
const express = require("express");
const router = express.Router();

const {
  createStore,
  getStores,
  getMyStores,
  getStoreById,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");

const { protect } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getStores);

// Authenticated routes
router.get("/my", protect, getMyStores);
router.post("/", protect, createStore);
router.get("/:id", getStoreById);
router.put("/:id", protect, updateStore);
router.patch("/:id", protect, updateStore);
router.delete("/:id", protect, deleteStore);

module.exports = router;
