const ProjectService = require('../services/projects.service');
const CommentService = require('../services/comments.service');
const TeamService = require('../services/teams.service');
const url = require('url');

class ProjectsController {
  projectService = new ProjectService();
  commentService = new CommentService();
  teamService = new TeamService();

  getProject = async (req, res) => {
    try {
      const { id } = req.params;
      let loginUserId = null;

      if (res.locals.user) {
        const { id } = res.locals.user;
        loginUserId = id;
      }

      const project = await this.projectService.findProjectById(id);
      const { comments, nextCursor, existNextComment } =
        await this.commentService.findCommentsByProjectId(id);
      const applyUsers = await this.teamService.findApplysByProjectId(id);

      let applyCheck = false;

      if (applyUsers.filter((apply) => apply.id === loginUserId).length !== 0) {
        applyCheck = true;
      }

      const pageTitle = `project #${id}`;

      return res.render('projectDetail', {
        project,
        comments,
        loginUserId,
        applyUsers,
        pageTitle,
        nextCursor,
        applyCheck,
        existNextComment,
      });
    } catch (error) {
      if (error.name === 'AlreadyDeadLine') {
        return res.render('404', {
          pageTitle: 'NoProject',
          pageContent: '프로젝트가 마감되었습니다.',
        });
      }
      return res.render('404', {
        pageTitle: 'NoProject',
        pageContent: '프로젝트를 찾을 수 없습니다.',
      });
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

  endProjectApply = async (req, res) => {
    try {
      const { id } = req.params;
      let userId;

      if (res.locals.user) {
        userId = res.locals.user.id;
      }

      await this.projectService.endProjectApply(id, userId);

      return res.status(200).json({ message: '공고 마감 완료' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  hardDeleteProject = (req, res) => {
    try {
      const { id } = req.params;
      this.projectService.hardDeleteProject(id);
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  //* /admin/projects 페이지 렌더링, 오프셋 기반 전체 프로젝트 조회 및 페이지네이션
  getOffsetBasedProjects = async (req, res) => {
    try {
      const { page, search } = req.query;
      const {
        pageInfo: { curPage, pageArr, prevPage, nextPage, totalPage },
        projects,
      } = await this.projectService.getOffsetBasedProjects(
        Number(page),
        search
      );
      return res.status(200).render('admin/projects', {
        pageTitle: '공고 관리',
        curPage,
        pageArr,
        prevPage,
        nextPage,
        totalPage,
        projects,
        search,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  //* 프로젝트 조회 관련 페이지 렌더링
  renderProjectsPage = async (req, res) => {
    try {
      const { pathname } = url.parse(req.url);
      const { cursor, search } = req.query;
      let id;

      if (res.locals.user) {
        id = res.locals.user.id;
      }

      const { nextCursor, page, projects, pageTitle, allProjectCount } =
        await this.projectService.getCursorBasedProjects(
          pathname,
          cursor,
          search,
          id
        );
      return res.status(200).render(page, {
        pageTitle,
        nextCursor,
        projects,
        search,
        allProjectCount,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  //* 페이지별 커서 기반 전체 프로젝트 조회 및 페이지네이션
  getCursorBasedProjects = async (req, res) => {
    try {
      const { cursor, site, search } = req.query;
      let id;

      if (res.locals.user) {
        id = res.locals.user.id;
      }

      const { nextCursor, projects } =
        await this.projectService.getCursorBasedProjects(
          site,
          cursor,
          search,
          id
        );
      return res.status(200).json({ nextCursor, projects });
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

  //* 해당 유저의 프로젝트 보기
  // getProjectByUser = async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const findProjectByUser = await this.projectService.findProjectByUser(id);

  //     res.status(200).json(findProjectByUser);
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // };

  //* 썸네일 이미지 업로드
  uploadThumbnail = (req, res) => {
    try {
      const { originalname } = req.file;
      this.projectService.verifyThumbnail(originalname);
      return res.status(200).json({ image: req.file.location });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  //* 프로젝트 좋아요
  postProjectLike = async (req, res) => {
    try {
      const userId = res.locals.user.id;
      const projectId = req.params.id;

      const statusCode = await this.projectService.postProjectLike(
        userId,
        projectId
      );

      return res.sendStatus(statusCode);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  //* 프로젝트 좋아요 해제
  deleteProjectLike = async (req, res) => {
    try {
      const userId = res.locals.user.id;
      const projectId = req.params.id;

      const statusCode = await this.projectService.deleteProjectLike(
        userId,
        projectId
      );

      return res.sendStatus(statusCode);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

module.exports = ProjectsController;
