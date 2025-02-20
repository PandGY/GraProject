// utils/crypto.js
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// 生成随机对称密钥（AES-256）
export function generateSymmetricKey() {
  return randomBytes(32); // 32 bytes = 256 bits
}

// 使用对称密钥加密数据（AES-256-CBC）
export function encryptWithKey(data, key) {
  const iv = randomBytes(16); // 初始向量
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// 使用对称密钥解密数据
export function decryptWithKey(encryptedData, key, ivHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedBuffer = Buffer.from(encryptedData, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

