import FabricService from '../services/fabric.js'
import IPFSService from '../services/ipfs.js'
import { generateSymmetricKey, encryptWithKey } from '../utils/crypto.js'

class ContractController {
  async uploadContract(req, res) {
    try {
      const { buffer } = req.file
      const userId = req.user.id

      //1. 生成对称密钥并加密文件
      const key = generateSymmetricKey()
      const { iv, encryptedData } = encryptWithKey(buffer, key)

      //2. 上传加密后的数据到 IPFS
      const encryptedBuffer = Buffer.from(encryptedData, 'hex')
      const cid = await IPFSService.uploadFile(encryptedBuffer)

      //3. 调用链码上链   上链时需要保存密钥和 IV（实际应加密存储）
      const result = await FabricService.invokeContract(
        userId, 
        'mychannel',
        'econtract-cc',
        'UploadContract',
        [cid, key.toString('hex'), iv]) // 将密钥和 IV 上链

      res.json({ cid, txId: result})
    }catch(err) {
      res.status(500).send(err.message)
    }
  }

  async verifyContract(req, res) {
    // 实现核验逻辑
  }
}

export default new ContractController()