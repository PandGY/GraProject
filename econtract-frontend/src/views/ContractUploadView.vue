<!-- 合同上传 -->
<script setup lang="ts">
import { useContractStore } from '@/stores/useContractStore';
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import router from '@/router/index'


const contractStore = useContractStore()

const file = ref<File | null>(null)
const formData = ref({
  description: '',
  accessControl: [] as string[],
  encryptionKey: '',
  iv: ''
})

const handleUpload = async () => {
  if (!file.value) {
    ElMessage.warning('请先选择合同文件')
    return
  }

  try {
        await contractStore.submitContract(file.value, {
          description: formData.value.description,
          accessControl: formData.value.accessControl,
          key: formData.value.encryptionKey,
          iv: formData.value.iv
        })
        ElMessage.success('合同上传成功')
        // 上传成功后跳转
        router.push('/contracts')
  } catch(error) {
    ElMessage.error('合同上传失败: ' + (error as Error).message)
  }
}

</script>

<template>
  <div class="upload-container">
    <el-card class="upload-card" shadow="hover">
      <h2 class="page-title">
        <el-icon><Upload /></el-icon>
        合同上传
      </h2>

      <el-form label-width="120px" label-position="top">
        <!-- 文件上传 -->
        <el-form-item label="合同文件" required>
          <el-upload 
            :before-upload="(f) => { file = f; return false }"
            :show-file-list="false"
            accept=".pdf,.doc,.docx"
          >
            <template #trigger>
              <el-button type="primary">
                <el-icon><FolderOpened /></el-icon>
                选择文件
              </el-button>
            </template>
            <span v-if="file" class="file-name">{{ file.name }}</span>
          </el-upload>
          <div class="tip-text">支持格式：PDF/DOC/DOCX</div>
        </el-form-item>

        <!-- 合同描述 -->
        <el-form-item label="合同描述" required>
          <el-input 
            v-model="formData.description"
            placeholder="请输入合同简要描述"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <!-- 访问权限 -->
        <el-form-item label="访问权限">
          <el-select 
            v-model="formData.accessControl"
            multiple
            placeholder="选择可访问机构"
            class="full-width"
          >
            <el-option label="法院" value="court"/>
            <el-option label="律所A" value="lawyer:1"/>
            <el-option label="律所B" value="lawyer:2"/>
          </el-select>
          <div class="tip-text">不选择则默认公开</div>
        </el-form-item>

        <el-form-item label="加密密钥" required>
          <el-input v-model="formData.encryptionKey" placeholder="输入HEX格式密钥"/>
        </el-form-item>

        <el-form-item label="初始向量" required>
          <el-input v-model="formData.iv" placeholder="输入HEX格式IV"/>
        </el-form-item>

        <!-- 提交按钮 -->
        <el-button 
          type="primary"
          @click="handleUpload"
          :loading="contractStore.isLoading"
          class="submit-btn"
        >
          <el-icon><Upload /></el-icon>
          提交上链
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.upload-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.upload-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  
  :deep(.el-card__body) {
    padding: 2rem;
  }
}

.page-title {
  display: flex;
  align-items: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  
  .el-icon {
    margin-right: 0.8rem;
    font-size: 1.5rem;
  }
}

.file-name {
  margin-left: 1rem;
  color: #666;
}

.tip-text {
  font-size: 0.8rem;
  color: #999;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
}

.submit-btn {
  width: 100%;
  height: 45px;
  font-size: 1rem;
  
  .el-icon {
    margin-right: 0.5rem;
  }
}
</style>