'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectUser extends Model {
    static associate(models) {
      models.ProjectUser.hasMany(models.User);
      models.ProjectUser.hasMany(models.Project);
      models.ProjectUser.belongsTo(models.User);
      models.ProjectUser.belongsTo(models.Project);
    }
  }
  ProjectUser.init({
    role_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: false,
    modelName: 'ProjectUser',
    tableName: 'projectUsers',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return ProjectUser;
}