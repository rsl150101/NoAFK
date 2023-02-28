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
      models.User.hasMany(models.Project, { through: models.ProjectUser });
      models.User.hasMany(models.Comment, { foreignKey: 'userId' });
      models.User.hasMany(models.Chatting, { foreignKey: 'userId' });
      models.User.belongsTo(models.Project, { through: models.ProjectUser });
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
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
