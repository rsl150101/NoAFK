const CommentService = require('../services/comments.service');

class CommentsController {
  commentService = new CommentService();
  postComment = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { content } = req.body;
      const userId = 5; // 임시 Todo <정지우> 미들웨어사용

      const comment = await this.commentService.createComment(
        projectId,
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
      const { projectId } = req.params;

      const comments = await this.commentService.findCommentsById(projectId);

      return res.status(200).json(comments);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}

module.exports = CommentsController;
