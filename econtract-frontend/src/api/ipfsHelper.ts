// IPFS 工具类
import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto-browserify';

/**
 * 生成 AES-256 对称加密密钥
 * @returns {Buffer} 32字节的随机密钥
 */
export const generateSymmetricKey = (): Buffer => {
  return randomBytes(32)  // AES-256 需要32字节密钥
}

/**
 * 使用对称密钥加密数据
 * @param {Buffer} data - '要加密的原始数据
 * @param {Buffer} key - 加密密钥（必须32字节）
 * @returns {{
 *  iv: string, // 16字节初始向量（HEX）
 *  encryptedData: string,  // 加密后的数据（HEX）
 * }} 加密结果
 * @throws {Error} 密钥长度无效
 */
export const encryptWithKey = (data: Buffer, key: Buffer): { iv: string, encryptedData: string} => {
  if (key.length !== 32) {
    throw new Error('Invalid key length. Expected 32 bytes for AES-256')
  }

  const iv = randomBytes(16) // cbc模式需要16字节iv
  const cipher = createCipheriv('aes-256-cbc', key, iv)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  }

}

/**
 * 使用对称密钥解密数据
 * @param {string} encryptedDataHex - 加密数据（HEX格式）
 * @param {Buffer} key - 加密密钥
 * @param {string} ivHex - 初始向量（HEX格式）
 * @returns {Buffer} 解密后的原始数据
 * @throws {Error} 解密失败（密钥/iv不匹配）
 */
export const decryptWithKey = (encryptedDataHex: string,
  key: Buffer,
  ivHex: string): Buffer => {
  const iv = Buffer.from(ivHex, 'hex')
  const encryptedData = Buffer.from(encryptedDataHex,'hex')

  const decipher = createDecipheriv('aes-256-cbc', key, iv)

  return Buffer.concat([decipher.update(encryptedData), decipher.final()])
  }

/**
 * 计算文件hash（可选扩展）
 * @param {Buffer} data - 文件数据
 * @returns {string} SHA-256 哈希值（HEX）
 */
export const calculateFileHash = (data: Buffer): string => {
  return createHash('sha256').update(data).digest('hex')
}