export type ContractStatus = 'pending' | 'verified' | 'expired'


export interface ContractVerification {
  timestamp: number,
  result: boolean,
  verifier?: string
}

// contract类型
export interface Contract {
  cid: string,
  timestamp: number,
  metadata: {
    description: string,
    encryptionScheme: 'AES-256' | 'SM4',
    accessControl: string[],
    storageNodes: string[]
  },
  status: ContractStatus,
  verificationHistory: ContractVerification[]
}

export interface ContractUploadResponse {
  cid: string,
  timestamp: number,
  storageNodes: string[]
}