// 导入 Fabric 合约基础类
import { Contract } from 'fabric-contract-api'

/**
 * 电子合同智能合约类
 * @class
 * @extends Contract
 */
export default class EContractContract extends Contract {

  /**
   * 初始化账本（首次部署时自动调用）
   * @async
   * @param {Context} ctx - 交易上下文对象
   */
  async initLedger(ctx) {
    console.info('============= 初始化空账本 ===========')
    // 初始化一个空合同列表
    const contracts = []

    // 将空列表写入账本（使用 CONTRACTS_LIST 作为键）
    // Buffer.from() 用于将数据转换为二进制格式
    await ctx.stub.putState('CONTRACTS_LIST', Buffer.from(JSON.stringify(contracts)))

    console.info('============= 账本初始化完成 ===========')
  }

  /**
   * 创建新合同
   * @async
   * @param {Context} ctx - 交易上下文
   * @param {string} contractId - 合同唯一ID
   * @param {string} owner - 合同所有者
   * @param {string} contentHash - 合同内容哈希值
   * @returns {string} 创建成功的合同JSON字符串
   * @throws 如果合同已存在会抛出错误
   */
  async createContract(ctx, contractId, owner, contentHash) {
    // 检查合同是否存在
    const exists = await this.contractExists(ctx, contractId)
    if (exists) {
      throw new Error(`合同${contractId}已存在`)
    }

    // 构建合同对象
    const contract = {
      contractId,       // 合同唯一标识
      owner,            // 合同所有者
      contentHash,      // 合同内容哈希（用于验证内容完整性）
      status: 'DRAFT',  // 初始状态为草稿
      created: new Date().toISOString(),  // 创建时间（ISO格式）
      modified: new Date().toISOString()  // 最后修改时间  
    }

    // 将合同存入账本
    await ctx.stub.putState(
      contractId,
      Buffer.from(JSON.stringify(contract)))  // 需要将对象转为字符串再转为Buffer
    
    // 将合同id添加到总表
    await this.addToContractList(ctx, contractId)

    return JSON.stringify(contract)
  }


  /**
   * 查询合同详细信息
   * @async
   * @param {Context} ctx - 交易上下文
   * @param {string} contractId - 要查询的合同ID
   * @returns {string} 合同数据的JSON字符串
   * @throws 如果合同不存在会抛出错误
   */
  async queryContract(ctx, contractId) {
    // 从账本获取合同数据（返回二进制Buffer）
    const contractJSON = await ctx.stub.getState(contractId)

    // 查看数据是否存在
    if (!contractJSON || contractJSON.length === 0) {
      throw new Error(`合同${contractId}不存在`)
    }

    // 将Buffer转为字符串返回
    return contractJSON.toString()
  }



  //------------------------ 私有方法 ------------------------
  /**
   * 检查合同是否存在（私有方法）
   * @private
   * @param {Context} ctx - 交易上下文
   * @param {string} contractId - 合同ID
   * @returns {boolean} 是否存在
   */
  async contractExists(ctx, contractId) {
    // 尝试获取合同数据
    const contractJSON = await ctx.stub.getState(contractId)
    // 如果存在且长度>0则返回true
    return contractJSON && contractJSON.length > 0
  }

  /**
   * 将合同ID添加到总列表（私有方法）
   * @private
   * @param {Context} ctx - 交易上下文
   * @param {string} contractId - 要添加的合同ID
   */
  async addToContractList(ctx, contractId) {
    // 获取当前合同列表
    const contracts = JSON.parse(
      await ctx.stub.getState('CONTRACTS_LIST')
    )

    // 添加新合同id
    contracts.push(contractId)

    // 更新账本中的列表
    await ctx.stub.putState(
      'CONTRACTS_LIST',
      Buffer.from(JSON.stringify(contracts))
    )
  }
}