const express = require("express");
const router = express.Router();
const problemController = require("../Controller/problem");

// Student raises a problem
router.post("/", problemController.createProblem);

// Admin/Student get all problems
router.get("/", problemController.getAllProblems);

// Get problem by ID
router.get("/:id", problemController.getProblemById);

// Admin updates status (pending → in-process → resolved)
router.patch("/:id/status", problemController.updateStatus);

module.exports = router;