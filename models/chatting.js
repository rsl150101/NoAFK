'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatting extends Model {
    static associate(models) {
      models.Chatting.belongsTo(models.User);
    }
  }
  Chatting.init({
    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    msg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: false,
    modelName: 'Chatting',
    tableName: 'chattings',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  return Chatting;
}