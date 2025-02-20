import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
    {
      path: '/',
      redirect: '/contracts'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/contracts',
      name: 'ContractList',
      component: () => import('@/views/ContractListView.vue'),
      meta: { requireAuth: true }
    },
    {
      path: '/upload',
      name: 'ContractUpload',
      component: () => import('@/views/ContractUploadView.vue'),
      meta: { requiresAuth: true, role: 'lawyer' }
    },
    {
      path: '/contract/:cid',
      name: 'ContractDetail',
      component: () => import('@/views/ContractDetailView.vue'),
      meta: { requiresAuth: true }
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach( async (to, from, next) => {
  const authStore = useAuthStore()

  // 需要登录
  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // 角色权限检查
  if (to.meta.role && authStore.currentUser?.role !== to.meta.role) {
    return next('/contracts')
  }

  next()
})

export default router