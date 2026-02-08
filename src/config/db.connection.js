const { Sequelize } = require('sequelize')

const isProd = process.env.NODE_ENV === 'production'


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',

    logging: isProd ? false : console.log,

    pool: {
      max: 10,          
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    dialectOptions: isProd ? 
        {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {},

    retry: {
      max: 3
    },

    define: {
      timestamps: true,
      underscored: false
    }
  }
)


async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('Postgres connected')
  } catch (err) {
    console.error('DB connection failed:', err.message)
    process.exit(1)
  }
}


module.exports = { sequelize, connectDB }
