const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  dateOfPay: { type: Date, required: true },
  method: { type: String, enum: ["Cash", "UPI", "Bank Transfer"], required: true },
  transactionId: { type: String, required: true },
  monthOfPayment: { type: String, required: true }, // e.g. "September 2025"
  screenshotUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);