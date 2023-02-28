'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.ProjectUser);
      models.User.hasMany(models.Project);
      models.User.hasMany(models.Comment);
      models.User.hasMany(models.Chatting);
      models.User.belongsTo(models.ProjectUser);
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    auth_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    test_result: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    introduction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: false,
    modelName: 'User',
    tableName: 'users',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return User;
}