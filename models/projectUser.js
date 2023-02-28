'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectUser extends Model {
    static associate(models) {
      models.ProjectUser.belongsTo(models.User, { foreignKey: 'user_id' });
      models.ProjectUser.belongsTo(models.Project, { foreignKey: 'project_id' });
    }
  }
  ProjectUser.init(
    {
      role_level: {
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      paranoid: false,
      modelName: 'ProjectUser',
      tableName: 'projectUsers',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );
  return ProjectUser;
};
