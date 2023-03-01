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
      models.Chatting.belongsTo(models.User, { foreignKey: 'user_id' });
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Chatting',
      tableName: 'chattings',
      underscored: true,
    }
  );
  return Chatting;
};
