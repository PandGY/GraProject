// 处理api错误
export const handleApiError = (error: unknown) => {
  const err = error as any
  const message = err.response?.data?.message || err.message
  console.error(`API Error ${message}`)

  throw new Error(message)
}

// 生成加密头
export const getEncryptionHeaders = () => ({
  'Content-Encryption': 'AES-256',
  'Key-Format': 'HEX'
})