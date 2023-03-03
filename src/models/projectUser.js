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
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_id: {
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
