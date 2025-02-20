// 用户角色类型
export type UserTYpe = 'user' | 'lawyer' | 'court'

// 基础用户类型
export interface User {
  id: number,
  username: string,
  phone: string,
  role: UserTYpe,
  /**
   * 注意：前端通常不需要处理密码字段
   * 只有在注册/修改密码时需要
   */
  password?: string
}

// api请求/响应类型
// 登录
export interface LoginPayLoad {
  username: string,
  password: string 
}

// 注册
export interface RegisterPayLoad extends LoginPayLoad {
  role: UserTYpe,
  idNumber?: string, // 如有实名认证需求
  organization?: string // 律所/法院名称（如果是律师或法院用户）
}

// 用户响应
export interface UserResponse {
  user: Omit<User, 'password'>,
  token: string
}

// 带扩展的用户类型（根据业务需求）
export type ExtendedUser = User & {
  createdAt?: Date
  lastLogin?: Date
  permissions: string[] // 权限列表
}

// 用户列表分页类型
export interface UserPagination {
  page: number
  pageSize: number
  total: number
  list: Omit<User, 'password'>[]
}


