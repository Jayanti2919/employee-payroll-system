const { DataTypes } = require('sequelize')
const connection = require('../utils/Connection.js')

const Companies = connection.define('companies', {
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
    contact_number: {
        type: DataTypes.BIGINT,
        unique: true,
    }, 
    started_on: {
        type: DataTypes.DATE,
    },
    gstno : {
        type: DataTypes.STRING,
    }, 
    teamids: {
        type: DataTypes.JSON,
    },
    status : {
        type: DataTypes.ENUM,
        values: ['active', 'inactive'],
    },
})

module.exports = Companies;