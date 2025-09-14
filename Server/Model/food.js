const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  mealType: {
    type: String,
    enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
    required: true
  },
  startTime: {
    type: String, // e.g., "08:00 AM"
    required: true
  },
  endTime: {
    type: String, // e.g., "09:00 AM"
    required: true
  },
  foodItems: {
    type: [String], // e.g., ["Oats", "Milk", "Banana"]
    required: true
  }
});

const foodPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true
  },
  date: {
    type: Date, // e.g., 2025-09-14
    required: true,
    unique: true // ensure only one plan per date
  },
  meals: [mealSchema]
}, { timestamps: true });

module.exports = mongoose.model("FoodPlan", foodPlanSchema);