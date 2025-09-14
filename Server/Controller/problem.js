const problemService = require("../Services/problemservices");

class ProblemController {
  async createProblem(req, res) {
    try {
      const problem = await problemService.createProblem(req.body);
      res.status(201).json({ success: true, data: problem });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAllProblems(req, res) {
    try {
      const problems = await problemService.getAllProblems();
      res.status(200).json({ success: true, data: problems });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getProblemById(req, res) {
    try {
      const problem = await problemService.getProblemById(req.params.id);
      if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });
      res.status(200).json({ success: true, data: problem });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const problem = await problemService.updateStatus(req.params.id, status);
      if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });
      res.status(200).json({ success: true, data: problem });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ProblemController();