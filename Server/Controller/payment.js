const cloudinary = require("cloudinary").v2;
const paymentService = require("../Services/paymentservice");

// upload config (should be in a config file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createPayment = async (req, res) => {
  try {
    const file = req.file; // multer uploads file
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "pg_payments",
    });

    const newPayment = await paymentService.createPayment({
      ...req.body,
      screenshotUrl: result.secure_url,
    });

    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};