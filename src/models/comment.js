'use strict'
const { Model } = require('sequelize');
module.exports = (Sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      models.Comment.belongsTo(models.User);
      models.Comment.belongsTo(models.Project);
    }
  }
  Comment.init({
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: false,
    modelName: 'Comment',
    tableName: 'comments',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return Comment;
}