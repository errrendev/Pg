const Payment = require("../Model/payment");
const cloudinary = require("../Config/cloudnary");

const uploadScreenshot = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, { folder: "payments" });
};

const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  return await payment.save();
};

const getAllPayments = async () => {
  return await Payment.find().sort({ createdAt: -1 });
};

const getPaymentsByMonth = async (month) => {
  return await Payment.find({ monthOfPayment: month });
};

const getPaymentsByStudent = async (studentName) => {
  return await Payment.find({ studentName: studentName });
};

module.exports = {
  uploadScreenshot,
  createPayment,
  getAllPayments,
  getPaymentsByMonth,
  getPaymentsByStudent,
};