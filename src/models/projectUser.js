'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectUser extends Model {
    static associate(models) {
      models.ProjectUser.belongsTo(models.User, { foreignKey: 'user_id' });
      models.ProjectUser.belongsTo(models.Project, {
        foreignKey: 'project_id',
      });
    }
  }
  ProjectUser.init(
    {
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '담당업무를 정해주세요.',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ProjectUser',
      tableName: 'projectUsers',
      underscored: true,
    }
  );
  return ProjectUser;
};
