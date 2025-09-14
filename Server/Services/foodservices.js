const FoodPlan = require("../Model/food");

// Create or Update Food Plan for a specific date
exports.createOrUpdateFoodPlan = async (day, date, meals) => {
  return await FoodPlan.findOneAndUpdate(
    { date },
    { day, date, meals },
    { new: true, upsert: true }
  );
};

// Get Food Plan by Date
exports.getFoodPlanByDate = async (date) => {
  return await FoodPlan.findOne({ date });
};

// Get All Food Plans
exports.getAllFoodPlans = async () => {
  return await FoodPlan.find().sort({ date: 1 });
};

// Add a meal to existing food plan (by date)
exports.addMealToDate = async (date, meal) => {
  const foodPlan = await FoodPlan.findOne({ date });
  if (!foodPlan) {
    throw new Error(`No food plan found for date ${date}`);
  }
  foodPlan.meals.push(meal);
  return await foodPlan.save();
};