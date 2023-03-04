const ProjectService = require('../services/projects.service');

class ProjectController {
  projectService = new ProjectService();

  getProject = async (req, res) => {
    try {
      const { projectId } = req.params;

      const project = await this.projectService.findProjectById(projectId);

      return res.status(200).json({ project });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}

module.exports = ProjectController;
