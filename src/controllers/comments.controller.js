const CommentService = require('../services/comments.service');
const { commentDataValidation } = require('../utility/joi');

class CommentsController {
  commentService = new CommentService();

  postComment = async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = await commentDataValidation.validateAsync(req.body);

      if (!res.locals.user) {
        return res.render('login.html');
      }
      const userId = res.locals.user.id;

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
      const { cursor } = req.query;

      const { comments, nextCursor, existNextComment } =
        await this.commentService.findCommentsByProjectId(id, cursor);

      return res.status(200).json({ comments, nextCursor, existNextComment });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  updateComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const content = await commentDataValidation.validateAsync(req.body);

      const updateComment = await this.commentService.updateComment(
        commentId,
        content
      );

      return res.status(200).json(updateComment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;

      const deleteComment = await this.commentService.deleteComment(commentId);

      return res.status(204).json(deleteComment);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}

module.exports = CommentsController;
