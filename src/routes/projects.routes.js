const express = require('express');
const ProjectController = require('../controllers/projects.controller');
const CommentsController = require('../controllers/comments.controller');

const router = express.Router();
const projectController = new ProjectController();
const commentsController = new CommentsController();

// Todo <정지우> projectId나 userId 가 없는 경우 처리해야 함.
// 모집공고 상세 보기
router.get('/:projectId', projectController.getProject);
// 모집공고 수정
router.patch('/:projectId', projectController.updateProject);
// 모집공고 삭제
router.delete('/:projectId', projectController.deleteProject);

// 모집공고 댓글 작성
router.post('/:projectId/comments', commentsController.postComment);
// 모집공고 댓글 조회
router.get('/:projectId/comments', commentsController.getComments);
// 모집공고 댓글 수정
router.patch('/:projectId/comments/:commentId');
// 모집공고 댓글 삭제
router.delete('/:projectId/comments/:commentId');

module.exports = router;
