const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class CommentRepository {
  constructor(CommentModel) {
    this.commentModel = CommentModel;
  }

  createComment = async (id, userId, content) => {
    try {
      await this.commentModel.create({
        content,
        userId,
        projectId: id,
      });
      return { message: '댓글 작성 성공!' };
    } catch (error) {
      throw error;
    }
  };

  findLastCommentByProjectId = async (projectId) => {
    try {
      return await this.commentModel.findOne({
        where: { projectId },
        order: [['id', 'desc']],
      });
    } catch (error) {
      throw error;
    }
  };

  findCommentsByProjectId = async (projectId, cursor, limit) => {
    try {
      return await this.commentModel.findAll({
        where: {
          [Op.and]: {
            id: { [Op.lt]: cursor },
            projectId,
          },
        },
        raw: true,
        limit,
        order: [['id', 'desc']],
      });
    } catch (error) {
      throw error;
    }
  };

  updateComment = async (id, content) => {
    try {
      await this.commentModel.update(content, { where: { id } });

      return { status: 200, message: '댓글 수정 성공' };
    } catch (error) {
      throw error;
    }
  };

  deleteComment = async (id) => {
    try {
      await this.commentModel.destroy({ where: { id } });

      return { status: 204, message: '댓글 삭제 성공' };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CommentRepository;
