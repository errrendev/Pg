const paymentService = require("../services/paymentservice");

exports.addPayment = async (req, res) => {
  try {
    const { studentName, roomNumber, amount, dateOfPay, method, transactionId, monthOfPayment } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Screenshot is required" });
    }

    // Upload image to Cloudinary (via service)
    const uploadResult = await paymentService.uploadScreenshot(req.file.path);

    // Save payment (via service)
    const payment = await paymentService.createPayment({
      studentName,
      roomNumber,
      amount,
      dateOfPay,
      method,
      transactionId,
      monthOfPayment,
      screenshotUrl: uploadResult.secure_url,
    });

    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Error saving payment", error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

exports.getPaymentsByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const payments = await paymentService.getPaymentsByMonth(month);
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};

exports.getPaymentsByStudent = async (req, res) => {
  try {
    const { studentName } = req.params;
    const payments = await paymentService.getPaymentsByStudent(studentName);
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error: error.message });
  }
};