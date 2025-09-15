const express = require("express");
const multer = require("multer");
const {
  addPayment,
  getPayments,
  getPaymentsByMonth,
  getPaymentsByStudent,
} = require("../Controller/payment");

const router = express.Router();

// Multer setup (store temp files before Cloudinary upload)
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/payments", upload.single("screenshot"), addPayment);
router.get("/payments", getPayments);
router.get("/payments/month/:month", getPaymentsByMonth);
router.get("/payments/student/:studentName", getPaymentsByStudent);

module.exports = router;