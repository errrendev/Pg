const express = require("express");
const router = express.Router();
const foodPlanController = require("../Controller/food");

router.post("/create", foodPlanController.createOrUpdateFoodPlan);
router.get("/", foodPlanController.getAllFoodPlans);
router.get("/:date", foodPlanController.getFoodPlanByDate);
router.post("/:date/addMeal", foodPlanController.addMealToDate);

module.exports = router;