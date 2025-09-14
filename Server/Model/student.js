const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  adharCardNumber: { type: String, unique: true, required: true },
  roomNumber: { type: String, required: true },
  course: { type: String, required: true },
  roomType: { 
    type: String, 
    enum: ["1 seater", "2 seater", "3 seater"], 
    required: true 
  },
  ac: { type: Boolean, default: false },
  mobileNumber: { type: String, required: true },
  parentMobileNumber: { type: String, required: true },
  collegeName: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },

  status: { 
    type: String, 
    enum: ["pending", "approved", "kicked"], 
    default: "pending" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);