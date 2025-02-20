<!-- 合同列表 -->
<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { useContractStore } from '@/stores/useContractStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const contractStore = useContractStore()
const authStore = useAuthStore()
const { contracts, isLoading } = storeToRefs(contractStore)

// 分页参数
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

onMounted(async () => {
  await contractStore.loadContracts(pagination.value.page, pagination.value.pageSize)
})

const handlePageChange = (page: number) => {
  pagination.value.page = page
  contractStore.loadContracts(page, pagination.value.pageSize)
}

</script>

<template>
  <div class="contract-container">
    <el-card class="contract-card" shadow="hover">
      <!-- 头部区域 -->
      <div class="list-header">
        <h2 class="page-title">合同管理列表</h2>
        <el-button 
          v-if="authStore.currentUser?.role == 'lawyer'" 
          type="primary"
          class="upload-btn"
          @click="$router.push('/upload')"
        >
          <el-icon><Plus /></el-icon>
          上传新合同
        </el-button>
      </div>

      <!-- 数据表格 -->
      <el-skeleton :loading="isLoading" animated :row="6">
        <template #default>
          <el-table 
            :data="contracts" 
            stripe
            style="width: 100%;"
            header-row-class-name="table-header"
          >
            <el-table-column prop="cid" label="合同CID" width="280">
              <template #default="{ row }">
                <div class="cid-cell">
                  <el-icon class="document-icon"><Document /></el-icon>
                  <el-link type="primary" :underline="false">{{ row.cid }}</el-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120" align="center">
              <template #default="{ row }">
                <el-tag 
                  :type="row.status === 'verified' ? 'success' : 'warning'"
                  effect="light"
                  round
                >
                  {{ row.status === 'verified' ? '已核验' : '待核验' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="meta.description" label="合同描述" min-width="200">
              <template #default="{ row }">
                <div class="description">
                  {{ row.meta.description || '暂无描述' }}
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="180" align="center">
              <template #default="{ row }">
                <div class="action-buttons">
                  <el-button
                    size="small"
                    @click="$router.push(`/contract/${row.cid}`)"
                    class="detail-btn"
                  >
                    详情
                  </el-button>
                  <el-button 
                    v-if="authStore.currentUser?.role == 'court'"
                    size="small"
                    type="success"
                    @click="contractStore.verifyCID(row.cid)"
                  >
                    核验
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-wrapper">
            <el-pagination 
              v-model:current-page="pagination.page"
              :page-size="pagination.pageSize"
              :total="pagination.total"
              layout="prev, pager, next, jumper"
              background
              @current-page="handlePageChange"
            />
          </div>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<style>
.contract-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.contract-card {
  border-radius: 12px;
  :deep(.el-card__body) {
    padding: 2rem;
  }
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.upload-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  .el-icon {
    margin-right: 0.5rem;
  }
}

/* 表格样式 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;

  .table-header th {
    background-color: #f8f9fa;
    color: #495057;
    font-weight: 600;
  }

  .el-table__row:hover {
    background-color: #f8f9fa !important;
  }
}

.cid-cell {
  display: flex;
  align-items: center;
  .document-icon {
    color: var(--el-color-primary);
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
}

.description {
  color: #6c757d;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;

  .detail-btn {
    background-color: #e9ecef;
    border: none;
    color: #495057;
    &:hover {
      background-color: #dee2e6;
    }
  }
}

.pagination-wrapper {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

</style>