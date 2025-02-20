<!-- 合同详情 -->
<script setup lang="ts">
import { useContractStore } from "@/stores/useContractStore";
import { useRoute } from "vue-router";


const route = useRoute()
const contractStore = useContractStore()
const cid = route.params.cid as string

// 当前合同详情
const currentContract = contractStore.currentContract

</script>

<template>
  <div class="detail-container">
    <el-card class="detail-card" shadow="hover">
      <!-- 标题区 -->
      <div class="header-group">
        <h2 class="page-title">
          <el-icon class="title-icon"><Document /></el-icon>
          合同详情
          <el-tag type="info" class="cid-tag">{{ cid }}</el-tag>
        </h2>
      </div>

      <!-- 基本信息 -->
      <el-descriptions border :column="2" class="meta-info" label-align="center">
        <el-descriptions-item label="当前状态">
          <el-tag
            :type="currentContract?.status === 'verified' ? 'success' : 'warning'"
            effect="light"
            round
          >
            {{ currentContract?.status === 'verified' ? '已核验' : '待核验' }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="上传时间">
          <div class="timestamp">
            {{ new Date(currentContract?.timestamp || 0).toLocaleDateString() }}
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="加密方案">
          <el-tag type="info" effect="dark">
            {{ currentContract?.metadata.encryptionScheme || 'AES-256' }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="存储节点">
          <div class="node-group">
            <el-tag
              v-for="(node,index) in currentContract?.metadata.storageNodes"
              :key="index"
              class="node-tag"
              type="info"
              effect="plain"
              round
            >
              <el-icon><Connection /></el-icon>
              {{ node }}
            </el-tag>
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 核验历史 -->
      <div class="verify-history">
        <h3 class="section-title">
          <el-ico><Colck /></el-ico>
          核验历史
        </h3>

        <el-timeline v-if="currentContract?.verificationHistory?.length">
          <el-timeline-item
            v-for="(verify, index) in currentContract?.verificationHistory"
            :key="index"
            :timestamp="new Date(verify.timestamp).toLocaleDateString()"
            :icon="verify.result ? 'CircleCheck' : 'CircleClose'"
            :type="verify.result ? 'success' : 'danger'"
            plcement="top"
          >
            <el-card shadow="never" class="history-card">
              <div class="verify-result">
                <span>核验结果:</span>
                <el-tag :type="verify.result ? 'success' : 'danger'">
                  {{ verify.result ? '有效' : '无效' }}
                </el-tag>
                <div v-if="verify.verifier" class="verifier">
                  <el-icon><User /></el-icon>
                  核验人:{{ verify.verifier }}
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <el-empty v-else description="暂无核验记录" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.detail-card {
  border-radius: 12px;
  :deep(.el-card__body) {
    padding: 2rem;
  }
}

.header-group {
  margin-bottom: 2rem;
  
  .page-title {
    display: flex;
    align-items: center;
    color: #2c3e50;
    font-weight: 600;
    
    .title-icon {
      margin-right: 0.8rem;
      font-size: 1.5rem;
      color: var(--el-color-primary);
    }
    
    .cid-tag {
      margin-left: 1rem;
      font-family: monospace;
    }
  }
}

.meta-info {
  margin-bottom: 2rem;
  
  :deep(.el-descriptions__header) {
    margin-bottom: 1.5rem;
  }
  
  :deep(.el-descriptions__label) {
    background-color: #f8f9fa;
    color: #495057;
    font-weight: 500;
  }
}

.node-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  .node-tag {
    padding: 0 0.8rem;
    .el-icon {
      margin-right: 0.3rem;
    }
  }
}

.verify-history {
  margin-top: 2rem;
  
  .section-title {
    display: flex;
    align-items: center;
    color: #2c3e50;
    font-size: 1.25rem;
    
    .el-icon {
      margin-right: 0.8rem;
      font-size: 1.2rem;
    }
  }
}

.history-card {
  border-radius: 8px;
  margin: 0.5rem 0;
  
  .verify-result {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    
    span {
      margin-right: 0.8rem;
    }
  }
  
  .verifier {
    display: flex;
    align-items: center;
    color: #6c757d;
    font-size: 0.9rem;
    
    .el-icon {
      margin-right: 0.5rem;
    }
  }
}
</style>