'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Chatting.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Chatting.init(
    {
      room: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      msg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Chatting',
    }
  );
  return Chatting;
};
