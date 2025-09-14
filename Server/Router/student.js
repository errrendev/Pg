const express = require("express");
const router = express.Router();
const studentController = require("../Controller/student");

// Create student account (pending by default)
router.post("/", studentController.createStudent);

// Get all students
router.get("/", studentController.getAllStudents);

// Approve student
router.patch("/:id/approve", studentController.approveStudent);

// Kick student
router.patch("/:id/kick", studentController.kickStudent);

module.exports = router;