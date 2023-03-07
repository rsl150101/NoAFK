const CommentService = require('../services/comments.service');

class CommentsController {
  commentService = new CommentService();

  postComment = async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = 5; // 임시 Todo <정지우> 미들웨어사용

      const comment = await this.commentService.createComment(
        id,
        userId,
        content
      );

      return res.status(201).json(comment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  getComments = async (req, res) => {
    try {
      const { id } = req.params;

      const comments = await this.commentService.findCommentsByProjectId(id);

      return res.status(200).json(comments);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  updateComment = async (req, res) => {
    try {
      const { projectId, commentId } = req.params;
      const content = req.body;
      console.log(projectId, commentId, content);

      const updateComment = await this.commentService.updateComment(
        commentId,
        content,
        projectId
      );

      return res.status(200).json(updateComment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  deleteComment = async (req, res) => {
    try {
      const { projectId, commentId } = req.params;

      const deleteComment = await this.commentService.deleteComment(
        projectId,
        commentId
      );

      return res.status(204).json(deleteComment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}

module.exports = CommentsController;
