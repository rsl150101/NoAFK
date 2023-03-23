'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Project.hasMany(models.ProjectUser, { foreignKey: 'project_id' });
      models.Project.hasMany(models.Comment, { foreignKey: 'project_id' });
      models.Project.belongsTo(models.User, { foreignKey: 'owner' });
    }
  }
  Project.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      person: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recruitDeadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      projectStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      projectEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '/./images/baseproject.png',
      },
      techStack: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      recommendLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'projects',
      underscored: true,
      paranoid: true,
    }
  );
  return Project;
};
