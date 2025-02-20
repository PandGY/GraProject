import { create } from 'ipfs-http-client'

class IPFSService {
  constructor() {
    this.client = create({ url: process.env.IPFS_API_URL})
  }

  async uploadFile(buffer) {
    const { cid } = await this.client.add(buffer)
    return cid.toString()
  }

  async downloadFile(cid) {
    const chunks = []
    for await (const chunk of this.client.cat(cid)) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  }
}

export default new IPFSService()