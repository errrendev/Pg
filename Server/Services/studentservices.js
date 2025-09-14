const Student = require("../Model/student");

class StudentService {
  async createStudent(data) {
    const student = new Student(data);
    return await student.save();
  }

  async getAllStudents() {
    return await Student.find();
  }

  async approveStudent(id) {
    return await Student.findByIdAndUpdate(id, { status: "approved" }, { new: true });
  }

  async kickStudent(id) {
    return await Student.findByIdAndUpdate(id, { status: "kicked" }, { new: true });
  }
}

module.exports = new StudentService();