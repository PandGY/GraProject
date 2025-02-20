// 合同操作接口
import axios from "axios"

/**
 * 合同服务 API 客户端
 */
const contractApi = axios.create({
  baseURL: 'http://localhost:3000/api/contracts',
  timeout: 10000  // 文件操作可能需要更长时间
})

/**
 * 上传加密合同到区块链
 * @param {FormData} formData - 包含以下字段的表单数据：
 *   - file: Blob - 加密后的合同文件
 *   - key: string - 加密密钥（HEX 格式）
 *   - iv: string - 初始向量（HEX 格式）
 * @returns {Promise<{ cid: string; txHash: string }>} IPFS CID 和区块链交易哈希
 * @throws {AxiosError} 413 - 文件过大 | 415 - 文件类型不支持
 * 
 * @example
 * const formData = new FormData();
 * formData.append('file', encryptedFile);
 * formData.append('key', 'a1b2c3...');
 * formData.append('iv', 'd4e5f6...');
 * await uploadContract(formData);
 */
export const uploadContract = async(formData: FormData) => {
  const response = await contractApi.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
  return response.data
}

/**
 * 查询用户合同列表
 * @param {number} [page=1] - 分页页码
 * @param {number} [pageSize=10] - 每页数量
 * @returns {Promise<Array<{
 *   cid: string;
 *   txHash: string;
 *   timestamp: string;
 *   status: 'pending'|'confirmed'
 * }>>} 合同元数据列表
 */
export const getContracts = async(page = 1, pageSize = 10) => {
  const response = await contractApi.get('/list', {
    params: { page, pageSize },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
  return response.data
}

/**
 * 验证合同有效性
 * @param {string} cid - 要验证的合同 CID
 * @returns {Promise<{
 *   isValid: boolean;
 *   blockNumber: number;
 *   verification: {
 *     hashMatch: boolean;
 *     signatureValid: boolean;
 *   }
 * }>} 验证结果详情
 * @throws {AxiosError} 404 - CID 不存在
 */
export const verifyContract = async (cid: string) => {
  const response = await contractApi.get(`/verify/${cid}`)
  return response.data
}
