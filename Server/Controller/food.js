const foodPlanService = require("../Services/foodservices");

// Create or Update Food Plan
exports.createOrUpdateFoodPlan = async (req, res) => {
  try {
    const { day, date, meals } = req.body;
    if (!day || !date || !meals || meals.length === 0) {
      return res.status(400).json({ message: "Day, date and meals are required." });
    }

    const foodPlan = await foodPlanService.createOrUpdateFoodPlan(day, date, meals);
    res.status(201).json({ message: "Food plan saved successfully", foodPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Food Plan by Date
exports.getFoodPlanByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const foodPlan = await foodPlanService.getFoodPlanByDate(new Date(date));

    if (!foodPlan) {
      return res.status(404).json({ message: `No food plan found for ${date}` });
    }

    res.status(200).json(foodPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Food Plans
exports.getAllFoodPlans = async (req, res) => {
  try {
    const foodPlans = await foodPlanService.getAllFoodPlans();
    res.status(200).json(foodPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Meal to Food Plan by Date
exports.addMealToDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { mealType, startTime, endTime, foodItems } = req.body;

    if (!mealType || !startTime || !endTime || !foodItems) {
      return res.status(400).json({ message: "All meal details are required." });
    }

    const updatedPlan = await foodPlanService.addMealToDate(new Date(date), {
      mealType, startTime, endTime, foodItems
    });

    res.status(200).json({ message: "Meal added successfully", updatedPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};