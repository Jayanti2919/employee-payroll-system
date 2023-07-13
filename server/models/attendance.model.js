const { DataTypes } = require('sequelize')
const connection = require('../utils/Connection.js')

const Attendance = connection.define('attendance', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    emp_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'employees',
            key: 'id',
        }
    },
    company_id : {
        type: DataTypes.BIGINT,
        references: {
            model: 'companies',
            key: 'id',
        }
    },
    date: {
        type: DataTypes.DATE,
    },
    attendance : {
        type: DataTypes.ENUM,
        values: ['Pending', 'Present'],
    },
})

module.exports = Attendance;