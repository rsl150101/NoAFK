'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      models.Project.hasMany(models.ProjectUser);
      models.Project.hasMany(models.Comment);
      models.Project.belongsTo(models.ProjectUser);
      models.Project.belongsTo(models.User);
    }
  }
  Project.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    person: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recruit_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    project_start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    project_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tech_stack: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recommend_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: false,
    modelName: 'Project',
    tableName: 'projects',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return Project;
}