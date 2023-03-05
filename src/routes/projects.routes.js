const express = require('express');
const ProjectController = require('../controllers/projects.controller');
const CommentsController = require('../controllers/comments.controller');

const router = express.Router();
const projectController = new ProjectController();
const commentsController = new CommentsController();

// Todo <정지우> projectId나 userId 가 없는 경우 처리해야 함.
// 모집공고 상세 보기
router.get('/:id', projectController.getProject);
// 모집공고 수정
router.patch('/:id', projectController.updateProject);
// 모집공고 삭제
router.delete('/:id', projectController.deleteProject);

// 모집공고 댓글 작성
router.post('/:id/comments', commentsController.postComment);
// 모집공고 댓글 조회
router.get('/:id/comments', commentsController.getComments);
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

module.exports = router;
