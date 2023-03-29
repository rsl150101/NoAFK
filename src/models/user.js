'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.ProjectUser, { foreignKey: 'user_id' });
      models.User.hasMany(models.Comment, { foreignKey: 'user_id' });
      models.User.hasMany(models.Chatting, { foreignKey: 'user_id' });
      models.User.hasMany(models.Project, { foreignKey: 'owner' });
      models.User.hasMany(models.ProjectLike, { foreignKey: 'user_id' });
    }
  }
  User.init(
    {
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
      loginMethod: {
        type: DataTypes.STRING,
        defaultValue: 'NoAFK',
      },
      authLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      testResult: {
        type: DataTypes.STRING,
      },
      introduction: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '/./images/baseprofile.png',
      },
      privateEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
      },
      expiredAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
    }
  );
  return User;
};
