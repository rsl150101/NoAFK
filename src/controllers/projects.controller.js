const ProjectService = require('../services/projects.service');

class ProjectController {
  projectService = new ProjectService();

  getProject = async (req, res) => {
    try {
      const { id } = req.params;

      const project = await this.projectService.findProjectById(id);

      return res.status(200).json(project);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const projectInfo = req.body;

      const updateProject = await this.projectService.updateProject(
        id,
        projectInfo
      );

      return res.status(200).json(updateProject);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  deleteProject = async (req, res) => {
    try {
      const { id } = req.params;

      const deleteProject = await this.projectService.deleteProject(id);

      return res.status(204).json(deleteProject);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}

module.exports = ProjectController;
