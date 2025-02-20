import { defineStore } from 'pinia'
import type { Contract } from '@/types/contract'
import { uploadContract, getContracts, verifyContract } from '@/api/contract'
import { useAuthStore } from '@/stores/useAuthStore'
import { computed, ref } from 'vue'

export const useContractStore = defineStore('contract', () => {
  const autnStore = useAuthStore()
  
  // 状态定义
  const contracts = ref<Contract[]>([])
  const currentCID = ref<string>('')
  const verificationResult = ref<{
    isValid: boolean,
    blockNumber: number,
    verication: {
      hashMatch: boolean,
      signatureValid: boolean
    }
  } | null>(null)
  const isLoading = ref(false)

  const currentContract = computed<Contract | undefined>(() => {
    return contracts.value.find(c => c.cid === currentCID.value)
  })

  // 获取合同列表
  const loadContracts = async (page = 1, pageSize = 10) => {
    isLoading.value = true
    try {
      const data = await getContracts(page, pageSize)
      contracts.value = data.map(formatContract)
    } catch(error) {
      console.error('加载合同失败', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 格式化合同数据
  const formatContract = (item: any): Contract => ({
    cid: item.cid,
    timestamp: new Date(item.timestamp).getTime(),
    metadata: {
      description: item.description || '',
      encryptionScheme: 'AES-256', // 根据实际数据调整
      accessControl: item.accessControl || [],
      storageNodes: item.storageNodes || []
    },
    status: item.status,
    verificationHistory: []
  })

  // 上传合同（带加密参数）
  const submitContract = async (
    file: File,
    meta: {
      description: string,
      accessControl: string[],
      key: string,
      iv: string
    }
  ) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('key', meta.key)
    formData.append('iv', meta.iv)
    formData.append('meta', JSON.stringify({
      description: meta.description,
      accessControl: meta.accessControl
    }))

    try {
      const { cid } = await uploadContract(formData)
      const newContract: Contract = {
        cid,
        timestamp: Date.now(),
        metadata: {
          ...meta,
          encryptionScheme: 'AES-256',
          storageNodes: []  // 根据实际响应数据填充
        },
        status: 'pending',
        verificationHistory: []
      }
      contracts.value.unshift(newContract)
      return cid
    } catch(error) {
      console.error('合同上传失败', error)
      throw error
    }
  }

  // 合同核验
  const verifyCID = async (cid: string) => {
    try {
      const result = await verifyContract(cid)
      verificationResult.value = result

      const contract = contracts.value.find(c => c.cid === cid)
      if (contract) {
        contract.verificationHistory.push({
          timestamp: Date.now(),
          result: result.isValid,
          verifier: autnStore.currentUser?.username
        })
        contract.status = result.isValid ? 'verified' : 'expired'
      }

      return result
    } catch(error) {
      console.error('核验失败', error)
      throw error
    }
  }

  return {
    contracts,
    currentCID,
    currentContract,
    verificationResult,
    isLoading,
    loadContracts,
    submitContract,
    verifyCID
  }
})