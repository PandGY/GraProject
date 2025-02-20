import { defineStore } from 'pinia'
import { login,register,refreshToken } from '@/api/auth'
import type { UserTYpe, LoginPayLoad, RegisterPayLoad } from '@/types/user'
// import { ApiResponse } from '@/types/api'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 状态定义
  const accessToken = ref<string | null>(localStorage.getItem('accessToken') || null)
  const currentUser = ref<{ username: string, role: UserTYpe } | null>(null)

  // 通用请求头生成
  const getAuthHeader = () => {
    Authorization: `Bearer ${accessToken.value}`
  }

  // 登录操作
  const handleLogin = async (payload: LoginPayLoad) => {
    try {
      const { accessToken: token } = await login(payload.username, payload.password)
      accessToken.value = token
      localStorage.setItem('accessToken', token)

      // 假设登录响应包含用户信息
      currentUser.value = {
        username: payload.username,
        role: 'user' // 根据实际响应调整
      }
    } catch(error) {
      console.error('登陆失败:', error)
      throw error
    }
  }

  // 注册操作
  const handleRegister = async (payload: RegisterPayLoad) => {
    try {
      const { userId } = await register({
        username: payload.username,
        password: payload.password,
        role: payload.role,
        organization: payload.organization
      })

      // 自动登录
      await handleLogin({
        username: payload.username,
        password: payload.password
      })
    } catch(error) {
      console.error('注册失败:', error)
      throw error
    }
  }

  // 刷新令牌
  const handleRefreshToken = async () => {
    try {
      const { accessToken: newToken } = await refreshToken()
      accessToken.value = newToken
      localStorage.setItem('accessToken', newToken)
    } catch(error) {
      console.error('令牌刷新失败:', error)
      logout()
      throw error
    }
  }

  // 登出操作
  const logout = () => {
    accessToken.value = null
    currentUser.value = null
    localStorage.removeItem('accessToken')
  }

  return {
    accessToken,
    currentUser,
    handleLogin,
    handleRegister,
    handleRefreshToken,
    logout,
    getAuthHeader
  }
})

