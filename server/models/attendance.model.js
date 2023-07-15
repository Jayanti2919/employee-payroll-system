const { DataTypes } = require('sequelize');
const connection = require('../utils/Connection.js');

const Attendance = connection.define('attendance', {
  emp_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  company_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'companies',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY, // Use DATEONLY to store only the date without the timestamp
    primaryKey: true,
  },
  attendance: {
    type: DataTypes.ENUM,
    values: ['Pending', 'Present'],
  },
});

module.exports = Attendance;
