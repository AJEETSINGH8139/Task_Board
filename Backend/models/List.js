// models/List.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const List = sequelize.define('List', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = List;
