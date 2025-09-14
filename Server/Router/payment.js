const express = require("express");
const multer = require("multer");
const paymentController = require("../Controller/payment");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary storage

router.post("/", upload.single("screenshot"), paymentController.createPayment);
router.get("/", paymentController.getPayments);

module.exports = router;