const studentService = require("../Services/studentservices");

class StudentController {
  async createStudent(req, res) {
    console.log(req.body)
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json({ success: true, data: student });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllStudents(req, res) {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json({ success: true, data: students });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async approveStudent(req, res) {
    try {
      const student = await studentService.approveStudent(req.params.id);
      res.status(200).json({ success: true, data: student });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async kickStudent(req, res) {
    try {
      const student = await studentService.kickStudent(req.params.id);
      res.status(200).json({ success: true, data: student });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new StudentController();