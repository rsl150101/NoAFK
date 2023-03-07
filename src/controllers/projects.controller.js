const ProjectService = require('../services/projects.service');
const CommentService = require('../services/comments.service');

class ProjectsController {
  projectService = new ProjectService();
  commentService = new CommentService();

  getProject = async (req, res) => {
    try {
      const { id } = req.params;
      let loginUserId = null;

      if (res.locals.user) {
        loginUserId = res.locals.user.id;
      }

      console.log(loginUserId);

      const project = await this.projectService.findProjectById(id);
      const comments = await this.commentService.findCommentsByProjectId(id);

      return res.render('projectDetail.html', {
        project,
        comments,
        loginUserId,
      });
    } catch (error) {
      console.log(error);
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

  //* 전체 프로젝트 페이지 렌더링
  renderProjectsPage = (req, res) => {
    return res.status(200).render('projects');
  };

  //* 전체 프로젝트 데이터 조회
  getProjects = async (req, res) => {
    try {
      const { page, site } = req.query;
      const projectsAndPage = await this.projectService.getProjects(
        Number(page),
        site
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
