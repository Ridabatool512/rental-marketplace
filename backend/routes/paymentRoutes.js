
const express = require("express");
const router = express.Router();

const {
  createDemoPayment,
  simulateDemoPayment,
  getMyPayments,
  getReceivedPayments,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/demo", protect, createDemoPayment);
router.post("/:id/simulate", protect, simulateDemoPayment);

router.get("/my", protect, getMyPayments);
router.get("/received", protect, getReceivedPayments);

module.exports = router;
