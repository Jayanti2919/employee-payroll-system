const { DataTypes } = require('sequelize')
const connection = require('../utils/Connection.js')

const Employee = connection.define('employee', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact_number: {
        type: DataTypes.BIGINT,
        unique: true,
    }, 
    designation: {
        type: DataTypes.STRING,
    },
    salary: {
        type: DataTypes.DOUBLE,
    },
    joining_date: {
        type: DataTypes.DATE,
    },
    company_id : {
        type: DataTypes.BIGINT,
        references: {
            model: 'companies',
            key: 'id',
        }
    }, 
    team_id : {
        type: DataTypes.BIGINT,
        references: {
            model: 'teams',
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
    status : {
        type: DataTypes.ENUM,
        values: ['active', 'inactive'],
    },
})

module.exports = Employee;