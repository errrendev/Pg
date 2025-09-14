const Payment = require("../Model/payment");

exports.createPayment = async (data) => {
  const payment = new Payment(data);
  return await payment.save();
};

exports.getAllPayments = async () => {
  return await Payment.find().sort({ createdAt: -1 });
};

exports.getPaymentById = async (id) => {
  return await Payment.findById(id);
};