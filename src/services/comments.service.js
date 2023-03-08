const CommentRepository = require('../repositories/comments.repository');
const { Comment } = require('../models');

class CommentService {
  commentsRepository = new CommentRepository(Comment);

  createComment = async (id, userId, content) => {
    try {
      return await this.commentsRepository.createComment(id, userId, content);
    } catch (error) {
      throw error;
    }
  };

  findCommentsByProjectId = async (id) => {
    try {
      return await this.commentsRepository.findCommentsByProjectId(id);
    } catch (error) {
      throw error;
    }
  };

  updateComment = async (commentId, content, projectId) => {
    try {
      return await this.commentsRepository.updateComment(
        commentId,
        content,
        projectId
      );
    } catch (error) {
      throw error;
    }
  };

  deleteComment = async (projectId, commentId) => {
    try {
      return await this.commentsRepository.deleteComment(projectId, commentId);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CommentService;
