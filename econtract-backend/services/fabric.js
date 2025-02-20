import { Gateway, Wallets } from 'fabric-network'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { readFileSync } from 'fs'

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class FabricService {
  constructor() {
    /**
     * 初始化Fabric网络连接配置
     * 建议将连接配置文件放在项目config目录下
     * 示例结构参考：https://hyperledger-fabric.readthedocs.io/en/release-2.4/deploy_chaincode.html
     */
    this.ccp = JSON.parse(
      readFileSync(resolve(__dirname, '../config/fabric-connection.json'))
    )
    /**
     * 钱包路径处理（确保绝对路径）
     * 环境变量示例：FABRIC_WALLET_PATH=./wallet
     */
    this.WalletPath = process.env.FABRIC_WALLET_PATH.startsWith('/')
      ? process.env.FABRIC_WALLET_PATH : resolve(process.cwd(), process.env.FABRIC_WALLET_PATH)
  }

  /**
   * 连接到Fabric网关
   * @param {string} userId - 用户身份标识（需提前注册到钱包）
   * @returns {Promise<Gateway>} 网关实例
   */
  async connect(userId) {
    // 创建文件系统钱包
    const wallet = await Wallets.newFileSystemWallet(this.WalletPath)

    // 验证用户身份是否存在
    if (!(await wallet.get(userId))) {
      throw new Error(`用户${userId}身份未在钱包中注册`)
    }

    const gateway = new Gateway()
    try {
      await gateway.connect(this.ccp, {
        wallet,
        identity: userId,
        discovery: {
          enabled: true,      // 启用服务发现
          asLocalhost: true   // 如果节点运行在本地Docker中需设为true
        },
        // 生产环境建议启用TLS
        // clientTlsIdentity: 'tlsUser' 
      })
      return gateway
    } catch(error) {
      console.error(`网关连接失败:${error.stack}`)
      throw new Error('FABRIC_GATEWAY_CONNECT_FAILED')
    }
  }

  
  /**
   * 调用智能合约
   * @param {string} userId - 用户身份
   * @param {string} channel - 通道名称
   * @param {string} contractName - 合约名称
   * @param {string} func - 调用的函数名
   * @param {Array} args - 函数参数数组
   * @returns {Promise<string>} 交易结果
   */
  async invokeContract(userId, channel, contractName, func, args) {
    let gateway
    try {
      // 步骤：1.建立网关连接
      gateway = await this.connect(userId)
    
      // 步骤2：获取指定通道网络
      const network = await gateway.getNetwork(channel)

      // 步骤3：获取合约实例
      const contract = network.getContract(contractName)

      /**
       * 步骤4：提交交易
       * submitTransaction vs evaluateTransaction：
       * - submitTransaction：写操作，需要排序节点确认
       * - evaluateTransaction：读操作，直接返回结果
       */
      const result = await contract.submitTransaction(func, ...args)

      // 步骤5：解析返回结果
      return result.toString('utf-8')
    } catch(error) {
      console.error(`[${new Date().toISOString()}] 链码调用异常`, {
        userId,
        channel,
        contractName,
        func,
        args,
        error: error.message
      })
      throw new Error(`CHAINCODE_INVOKE_ERROR: ${error.message}`)
    }finally {
      // 确保释放网关连接
      if (gateway) {
        gateway.disconnect()
        console.log('网关连接已安全关闭')
      }
    }
  }

  /**
   * 查询合约状态（只读操作）
   * @param {string} userId - 用户身份
   * @param {string} channel - 通道名称
   * @param {string} contractName - 合约名称 
   * @param {string} func - 查询函数名
   * @param {Array} args - 参数数组
   */
  async queryContract(userId, channel, contractName, func, args) {
    const gateway = await this.connect(userId)
    try {
      const network = await gateway.getNetwork(channel)
      const contract = network.getContract(contractName)
      const result = await contract.evaluateTransaction(func, ...args)
      return result.toString('utf-8')
    }finally {
      gateway.disconnect()
    }
  }

  /**
   * 批量交易处理（性能优化）
   * @param {Array<{func: string, args: Array}>} transactions - 交易数组
   */
  async batchTransactions(userId, channel, contractName, transactions) {
    const gateway = await this.connect(userId)
    try {
      const network = await gateway.getNetwork(channel)
      const contract = network.getContract(contractName)

      const results = []
      for(const { func, args } of transactions) {
        const result = await contract.submitTransaction(func, ...args)
        results.push(result.toString())
      }
      return results
    } finally {
      gateway.disconnect()
    }
  }

}

export default new FabricService()