const CommentRepository = require('../repositories/comments.repository');
const UserRepository = require('../repositories/users.repository');
const { Comment, User } = require('../models');

class CommentService {
  commentsRepository = new CommentRepository(Comment);
  userRepository = new UserRepository(User);

  createComment = async (id, userId, content) => {
    try {
      return await this.commentsRepository.createComment(id, userId, content);
    } catch (error) {
      throw error;
    }
  };

  findCommentsByProjectId = async (id, cursor) => {
    try {
      if (!cursor) {
        const lastComment =
          await this.commentsRepository.findLastCommentByProjectId(id);
        if (!lastComment) {
          cursor = null;
        } else {
          cursor = lastComment.id + 0.1;
        }
      }

      const projectId = id;
      const limit = 3;
      let comments;
      cursor = Number(cursor);

      comments = await this.commentsRepository.findCommentsByProjectId(
        projectId,
        cursor,
        limit
      );

      await Promise.all(
        comments.map(async (comment) => {
          const userId = comment.userId;
          const user = await this.userRepository.findUserInfoByUserId(userId);
          return (comment.nickname = user[0].nickname);
        })
      );

      const nextCursor = comments.length === limit ? comments.at(-1).id : null;

      let existNextComment =
        await this.commentsRepository.findCommentsByProjectId(
          projectId,
          nextCursor,
          limit
        );

      if (existNextComment.length === 0) {
        existNextComment = false;
      } else {
        existNextComment = true;
      }

      return { comments, nextCursor, existNextComment };
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
