const ProjectService = require('../services/projects.service');

class ProjectsController {
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

  //* 오프셋 기반 전체 프로젝트 조회 및 페이지네이션
  getOffsetBasedProjects = async (req, res) => {
    try {
      const { page } = req.query;
      const projectsAndPage = await this.projectService.getOffsetBasedProjects(
        Number(page)
      );

      return res.status(200).json(projectsAndPage);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  //* 프로젝트 생성
  createProject = async (req, res) => {
    try {
      await this.projectService.createProject(req.body);

      return res.sendStatus(201);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

module.exports = ProjectsController;
