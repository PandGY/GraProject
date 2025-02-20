import { Router } from 'express'
const router = Router()
import AuthController from '../controllers/auth.js'

// 用户注册
router.post('/register', AuthController.register)

// 用户登录
router.post('login', AuthController.login)

export default router