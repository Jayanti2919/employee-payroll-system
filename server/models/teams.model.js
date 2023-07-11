const { DataTypes } = require('sequelize')
const connection = require('../utils/Connection.js')

const Teams = connection.define('teams', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company_id : {
        type: DataTypes.BIGINT,
        references: {
            model: 'companies',
            key: 'id',
        }
    },
    description: {
        type: DataTypes.TEXT,
    },
    status : {
        type: DataTypes.ENUM,
        values: ['active', 'inactive'],
    },
})

module.exports = Teams;