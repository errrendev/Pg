const Problem = require("../Model/problem");

class ProblemService {
  async createProblem(data) {
    const problem = new Problem(data);
    return await problem.save();
  }

  async getAllProblems() {
    return await Problem.find();
  }

  async getProblemById(id) {
    return await Problem.findById(id);
  }

  async updateStatus(id, status) {
    return await Problem.findByIdAndUpdate(
      id,
      { status, lastUpdate: new Date() },
      { new: true }
    );
  }
}

module.exports = new ProblemService();