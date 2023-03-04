class CommentRepository {
  constructor(CommentModel) {
    this.commentModel = CommentModel;
  }

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
