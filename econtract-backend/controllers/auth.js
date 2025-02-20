import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

class AuthController {
  // 用户注册
  async register(req, res) {
    try {
      const { username, password, role } = req.body

      // 检查用户名是否存在
      const existingUser = await User.findOne({ where: { username } })
      if (existingUser) {
        return res.status(400).send('Username already exists')
      }

      // 哈希密码
      const saltRounds = 10
      const hashedPassword = await hash(password, saltRounds)

      // 创建用户
      const user = await User.create({
        username,
        password: hashedPassword,
        role: role || 'user'
      })

      res.status(201).json({ id: user.id, username: user.username})
    }catch(err) {
      res.status(500).send(err.message)
    }
  }

  //  用户登录
  async login(req, res) {
    try {
      const { username, password } = req.body

      // 查找用户
      const user = await User.findOne({ where: {username }})
      if(!user) {
        return res.status(401).send('Invalid credentials')
      }

      // 验证密码
      const isValidPassword = await compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).send('Invalid credentials')
      }

      // 生成 JWT
      const token = jwt.sign(
        { id: user.id, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
        )
      
      res.json({ token })
    }catch(err) {
      res.status(500).send(err.message)
    }
  }
}

export default new AuthController()