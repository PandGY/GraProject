// 1. 核心模块导入
import path from 'path'
import { fileURLToPath } from 'url'
import process from 'process'

// 2. 第三方模块导入
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// 3. 本地模块导入
import sequelize from './config/database.js'
import IPFSService from './services/ipfs.js'
import authRouter from './routes/auth.js'
import contractRouter from './routes/contract.js'

// 4. 环境变量配置
// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 加载环境变量
dotenv.config({
  path: path.resolve(__dirname, '.env')// 显式指定路径
})

// 5. 初始化 Express 应用
const app = express()
const PORT = process.env.PORT || 3000

// 6. 中间件配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // 生产环境应限制具体域名
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(express.json({ limit: '10mb' })) // 支持大文件上传
app.use(express.urlencoded({ extended: true }))

// 7. 数据库初始化
async function initializeDatabase() {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ force: false }) // 生产环境应关闭 force
    console.log('✅ 数据库连接成功')
  }catch(err) {
    console.log('❌ 数据库初始化失败:', err)
    process.exit(1) // 数据库连接失败时终止应用
  }
}

// 8. IPFS 服务测试
async function testIPFSConnection() {
  try {
    const testContent = Buffer.from('区块链毕业设计测试内容')
    const cid = await IPFSService.uploadFile(testContent)
    console.log('📦 IPFS 连接测试成功 CID:', cid)
  }catch(err) {
    console.log('❌ IPFS 连接失败:', err)
  }
}

// 9. 路由配置
app.use('/api/auth', authRouter)
app.use('/api/contract', contractRouter)

// 10. 全局错误处理
app.use((err, req, res, next) => {
  console.error('🔥 全局错误:', err.stack)
  res.status(500).json({
    code: 500,
    message: process.env.NODE_ENV === 'development' ? err.message: '服务器内部错误'
  })
})

// 11. 服务启动流程
async function startServer() {
  // 步骤顺序很重要！
  await initializeDatabase()
  await testIPFSConnection()

  app.listen(PORT, () => {
    console.log(`
    🚀 服务已启动
    =================================
    📍 环境模式: ${process.env.NODE_ENV || 'development'}
    📡 监听端口: http://localhost:${PORT}
    📊 数据库状态: ${ sequelize.config.database }@${sequelize.config.host}
    🌐 IPFS 节点: ${ process.env.IPFS_API_URL}
    =================================
    `)
  })
}

// 12. 启动应用
startServer().catch(err => {
  console.error('❌ 服务启动失败:', err)
  process.exit(1)
})

