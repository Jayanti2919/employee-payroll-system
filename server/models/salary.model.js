const { DataTypes } = require('sequelize')
const connection = require('../utils/Connection.js')

const Salary = connection.define('salaries', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    }, 
    company_id : {
        type: DataTypes.BIGINT,
        references: {
            model: 'companies',
            key: 'id',
        }
    }, 
    emp_id : {
        type: DataTypes.BIGINT,
        references: {
            model: 'employees',
            key: 'id',
        }
    }, 
    amount: {
        type: DataTypes.DOUBLE,
    },
    basic_pay: {
        type: DataTypes.DOUBLE,
    },
    total_allowance: {
        type: DataTypes.DOUBLE,
    },
    gross_salary: {
        type: DataTypes.DOUBLE,
    },
    total_deduction: {
        type: DataTypes.DOUBLE,
    },
    net_pay: {
        type: DataTypes.DOUBLE,
    },
    salary_slip: {
        type: DataTypes.STRING,
    }
})

module.exports = Salary;