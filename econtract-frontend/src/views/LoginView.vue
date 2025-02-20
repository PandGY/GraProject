<!-- 登录注册 -->

<script setup lang="ts">
import { useAuthStore } from "@/stores/useAuthStore";
import { ref } from "vue";

const authStore = useAuthStore()

const isRegister = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})
const registerForm = ref({
  username: '',
  password: '',
  role: 'user' as 'user' | 'lawyer' | 'court',
  organization: ''
})

const handleAuth = async () => {
  if (isRegister.value) {
    await authStore.handleRegister(registerForm.value)
  } else {
    await authStore.handleLogin(loginForm.value)
  }
}

</script>

<template>
  <div class="auth-container">
    <el-card class="auth-card" shadow="hover">
      <h2 class="auth-title">{{ isRegister? '用户注册' : '用户登录' }}</h2>

      <!-- 登录表单 -->
      <el-form v-if="!isRegister" :model="loginForm" label-position="top">
        <el-form-item label="用户名">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名" 
            clearable 
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input 
            v-model="loginForm.password" 
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form v-else :model="registerForm" label-position="top">
        <el-form-item label="用户名">
          <el-input 
            v-model="registerForm.username"
            placeholder="4-16位字母数字组合"
            clearable 
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="至少包含字母和数字"
            show-password
          />
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select 
            v-model="registerForm.role"
            placeholder="请选择用户类型"
            class="full-width"
          >
            <el-option label="普通用户" value="user" />
            <el-option label="律所用户" value="lawyer" />
            <el-option label="法院用户" value="court" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="registerForm.role !== 'user'" label="机构名称">
          <el-input v-model="registerForm.organization" placeholder="请输入完整机构名称"/>
        </el-form-item>
      </el-form>

      <div class="action-group">
        <el-button type="primary" @click="handleAuth" class="auth-button">
          {{ isRegister ? '注册' : '登录' }}
        </el-button>
        <el-button link @click="isRegister = !isRegister" class="toggle-button">
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background:linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)
}
.auth-card {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  transition: all 0.3s ease;

  :deep(.el-card__body) {
    padding: 2.5rem;
  }
}

.auth-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-weight: 600;
}

.el-form-item {
  margin-bottom: 1.5rem;
}

.el-input, .el-select {
  width: 100%;

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    padding: 0.8rem 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
  }
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.auth-button {
  width: 100%;
  height: 45px;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.toggle-button {
  width: fit-content;
  margin: 0 auto;
  color: #666;

  &:hover {
    color: var(--el-color-primary);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .auth-card {
    margin: 1rem;
    :deep(.el-card__body) {
      padding: 1.5rem;
    }
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
}
</style>





