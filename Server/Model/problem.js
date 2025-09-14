const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  number: { type: String, required: true }, // Student phone number
  category: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "medium" 
  },
  status: { 
    type: String, 
    enum: ["pending", "in-process", "resolved"], 
    default: "pending" 
  },
  dateReported: { type: Date, default: Date.now },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  lastUpdate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);