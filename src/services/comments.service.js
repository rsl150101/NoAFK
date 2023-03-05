const CommentRepository = require('../repositories/comments.repository');
const { Comment } = require('../models');

class CommentService {
  commentsRepository = new CommentRepository(Comment);

  createComment = async (projectId, userId, content) => {
    try {
      return await this.commentsRepository.createComment(
        projectId,
        userId,
        content
      );
    } catch (error) {
      throw error;
    }
  };

  findCommentsById = async (projectId) => {
    try {
      return await this.commentsRepository.findCommentsById(projectId);
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
}

module.exports = CommentService;
