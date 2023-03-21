const express = require('express');
const ProjectsController = require('../controllers/projects.controller');
const UsersController = require('../controllers/users.controller');

const router = express.Router();
const projectsController = new ProjectsController();
const usersController = new UsersController();

router.get('/projects', projectsController.getOffsetBasedProjects);
router.delete('/projects/:id', projectsController.hardDeleteProject);

//* 백오피스 - 회원관리
router.get('/users', usersController.renderAdminUserPage);
router.patch('/users/:id', usersController.blockUser);
router.delete('/users/:id', usersController.deleteUser);

module.exports = router;
