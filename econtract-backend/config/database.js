import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

// 从环境变量读取数据库配置
const sequelize = new Sequelize(
  process.env.DB_NAME,  // 数据库名
  process.env.DB_USER,  // 用户名
  process.env.DB_PASSWORD,  // 密码
  {
    host: process.env.DB_HOST,     // 数据库主机
    dialect: 'mysql',              // 数据库类型
    port: 3306,                    // 默认端口
    pool: {                        // 连接池配置
      max: 5,                      // 最大连接数
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: { // 高级选项
      ssl: process.env.DB_SSL === 'true' ? { require: true } : false,
      timezone: '+08:00'           // 设置时区为北京时间
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false  // 开发环境输出 SQL 日志
  }

)

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully...')
  }catch(error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1) // 连接失败时退出应用
  }
}

testConnection()

export default sequelize