const { DataTypes } = require('sequelize')
const connection = require('../utils/Connection.js')

const teamCode = connection.define('teamCode', {
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code:{
        type: DataTypes.TEXT,
        allowNull: false,
    },
    designation: {
        type: DataTypes.STRING,
    },
    salary: {
        type: DataTypes.DOUBLE,
    },
})

module.exports = teamCode;