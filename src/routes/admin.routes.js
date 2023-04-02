const express = require('express');
const ProjectsController = require('../controllers/projects.controller');
const UsersController = require('../controllers/users.controller');
const { checkToken, checkAdmin } = require('../middlewares/auth');

const router = express.Router();
const projectsController = new ProjectsController();
const usersController = new UsersController();

//* 백오피스 - 공고 관리
router.get(
  '/projects',
  checkToken,
  checkAdmin,
  projectsController.getOffsetBasedProjects
);
router.delete(
  '/projects/:id',
  checkToken,
  checkAdmin,
  projectsController.hardDeleteProject
);

//* 백오피스 - 회원 관리
router.get(
  '/users',
  checkToken,
  checkAdmin,
  usersController.renderAdminUserPage
);
router.patch(
  '/users/block/:id',
  checkToken,
  checkAdmin,
  usersController.blockUser
);
router.patch(
  '/users/pardon/:id',
  checkToken,
  checkAdmin,
  usersController.pardonUser
);
router.delete('/users/:id', checkToken, checkAdmin, usersController.deleteUser);

module.exports = router;
