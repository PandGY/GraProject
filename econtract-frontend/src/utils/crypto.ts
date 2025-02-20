import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto-browserify'

/**
 * 生成符合规范的加密密钥和初始向量
 * @returns { key: string; iv: string } HEX格式的密钥和IV
 */
export const generateEncryptionParams  = (): { key: string, iv: string} => {
  return {
    key: randomBytes(32).toString('hex'), // AES-256需要32字节
    iv: randomBytes(16).toString('hex')   // CBC模式需要16字节
  }
}

/**
 * 加密文件（前端专用）
 * @param file 要加密的File对象
 * @param hexKey HEX格式的加密密钥
 * @param hexIv HEX格式的初始向量
 * @returns 加密后的Blob对象和加密参数
 */
export const encryptFile = async (
  file: File,
  hexKey: string,
  hexIv: string
): Promise<File> => { // { encryptedBlob: Blob, params: { key: string, iv: string} }
  // 参数验证
  if (!hexKey.match(/^[0-9a-fA-F]{64}$/)) throw new Error('无效的密钥格式（需要64位HEX）')
  if (!hexIv.match(/^[0-9a-fA-F]{32}$/)) throw new Error('无效的IV格式（需要32位HEX）')

  const keyBuffer = Buffer.from(hexKey, 'hex')
  const ivBuffer = Buffer.from(hexIv, 'hex')

  // 读取文件内容
  const arrayBuffer = await file.arrayBuffer()
  const dataBuffer = Buffer.from(arrayBuffer)

  // 执行加密
  const cipher = createCipheriv('aes-256-cbc', keyBuffer, ivBuffer)
  const encrypted = Buffer.concat([cipher.update(dataBuffer), cipher.final()])

  return new File([encrypted], file.name, { type: file.type})
  // return {
  //   encryptedBlob: new Blob([encrypted], { type: file.type}),
  //   params: { key: hexKey, iv: hexIv}
  // }
}

/**
 * 计算文件哈希（SHA-256）
 * @param file 要计算的文件
 * @returns HEX格式的哈希值
 */
export const calculateFileHash = async (file: File): Promise<String> => {
  const arrayBuffer = await file.arrayBuffer()
  return createHash('256')
    .update(Buffer.from(arrayBuffer))
    .digest('hex')
}

/**
 * 解密方法（供下载时使用）
 */
export const decryptFile = async (
  encryptedBlob: Blob,
  hexKey: string,
  hexIv: string
): Promise<Blob> => {
  const keyBuffer = Buffer.from(hexKey, 'hex')
  const ivBuffer = Buffer.from(hexIv, 'hex')

  const arrayBuffer = await encryptedBlob.arrayBuffer()
  const encryptedData = Buffer.from(arrayBuffer)

  const decipher = createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer)
  const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()])

  return new Blob([decrypted])
}

// 类型声明
export interface EncryptionParams {
  key: string
  iv: string
}