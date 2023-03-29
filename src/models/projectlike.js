'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectLike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.ProjectUser.belongsTo(models.User, { foreignKey: 'user_id' });
      models.ProjectUser.belongsTo(models.Project, {
        foreignKey: 'project_id',
      });
    }
  }
  ProjectLike.init(
    {
      user_id: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ProjectLike',
      tableName: 'projectLikes',
      underscored: true,
    }
  );
  return ProjectLike;
};
