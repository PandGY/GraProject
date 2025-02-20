// 认证接口
import axios from "axios"

/**
 * 认证服务 API 客户端
 */
const authApi = axios.create({
  baseURL:'http://localhost:3000/api/auth',
  timeout:5000,
  withCredentials: true // 允许携带 Cookie（用于刷新令牌）
})

// Token 自动刷新拦截器
// 在 axios 实例中添加响应拦截
authApi.interceptors.response.use(response => response, async error => {
  if (error.response?.status === 401) {
    const newToken = await refreshToken()
    localStorage.setItem('jwt', newToken)
    error.config.headers.Authorization = `Bearer ${newToken}`
    return axios.request(error.config)
  }
  return Promise.reject(error)
})

/**
 * 用户登录接口
 * @param {string} username - 用户名（3-20位字母数字组合）
 * @param {string} password - 密码（至少8位，包含大小写和数字）
 * @returns {Promise<{ accessToken: string }>} 访问令牌
 * @throws {AxiosError} 401 - 无效凭证 | 429 - 频繁请求
 * 
 * @example
 * await login('user123x', 'Passw0rd!')
 */
export const login = async(username:string, password:string) => {
  const response = await authApi.post('/login', { username, password })
  return response.data
}

/**
 * 用户注册接口
 * @param {Object} params - 注册参数
 * @param {string} params.username - 用户名
 * @param {string} params.password - 密码
 * @param {'user'|'lawyer'|'court'} params.role - 用户角色
 * @param {string} [params.organization] - 所属机构（律师/法院必填）
 * @returns {Promise<{ userId: string }>} 新用户ID
 * @throws {AxiosError} 400 - 参数错误 | 409 - 用户名已存在
 */
export const register = async(params: {
  username: string,
  password: string,
  role: 'user' | 'lawyer' | 'court',
  organization?: string
}) => {
  const response = await authApi.post('/register', params)
  return response.data
}

/**
 * 刷新访问令牌
 * @returns {Promise<{ accessToken:string }>} 新访问令牌
 * @throws {AxiosError} 401 - 刷新令牌无效
 */
export const refreshToken = async() => {
  const response = await authApi.post('/refresh-token')
  return response.data
}

