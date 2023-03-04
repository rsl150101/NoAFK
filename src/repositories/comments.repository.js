class CommentRepository {
  constructor(CommentModel) {
    this.commentModel = CommentModel;
  }

  createComment = async (projectId, userId, content) => {
    try {
      await this.commentModel.create({
        content,
        user_id: userId,
        project_id: projectId,
      });
      return { message: '댓글 작성 성공!' };
    } catch (error) {
      throw error;
    }
  };

  findCommentsById = async (projectId) => {
    try {
      return await this.commentModel.findAll({
        where: { project_id: projectId },
      });
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CommentRepository;
