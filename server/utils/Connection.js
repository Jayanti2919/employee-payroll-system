const Sequelize = require('sequelize')

const connection = new Sequelize(
    'payroll',
    'root',
    '',
    {
      host:'localhost',
      dialect:'mysql',
    }
  )

module.exports=connection