const CommentRepository = require('../repositories/comments.repository');
const { Comment } = require('../models');

class CommentService {
  commentsRepository = new CommentRepository(Comment);

  findCommentsById = async (projectId) => {
    try {
      return await this.commentsRepository.findCommentsById(projectId);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CommentService;
