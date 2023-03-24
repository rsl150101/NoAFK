const express = require('express');
const ProjectsController = require('../controllers/projects.controller');
const CommentsController = require('../controllers/comments.controller');
const TeamsController = require('../controllers/teams.controller');

// 미들웨어추가
const { checkToken } = require('../middlewares/auth');
const { uploadProjectImage } = require('../middlewares/uploads');

const router = express.Router();
const projectsController = new ProjectsController();
const commentsController = new CommentsController();
const teamsController = new TeamsController();

//* 썸네일 이미지 업로드
router.post(
  '/image/upload',
  uploadProjectImage.single('thumbnail'),
  projectsController.uploadThumbnail
);

//* 공고 등록
router.post('/', projectsController.createProject);

// Todo <정지우> projectId나 userId 가 없는 경우 처리해야 함.
// 모집공고 상세 보기
router.get('/:id', checkToken, projectsController.getProject);
// 모집공고 수정
router.patch('/:id', projectsController.updateProject);
// 모집공고 삭제
router.delete('/:id', projectsController.deleteProject);

// 모집공고 참여 신청
router.post('/:projectId/applys', checkToken, teamsController.apply);
// 모집공고 신청 수락
router.patch('/:projectId/applys/:userId', teamsController.acceptApply);

// 모집공고 댓글 작성
router.post('/:id/comments', checkToken, commentsController.postComment);

// 모집공고 댓글 수정
router.patch(
  '/:projectId/comments/:commentId',
  commentsController.updateComment
);
// 모집공고 댓글 삭제
router.delete(
  '/:projectId/comments/:commentId',
  commentsController.deleteComment
);

//* 해당 유저의 프로젝트 보기
router.get('/:id/project', projectsController.getProjectByUser);
module.exports = router;
