import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  url: null as unknown as string,

  async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url)
  },

  async disconnect () {
    this.client.close()
    this.client = null
  },

  async getCollection (collectionName: string): Promise<Collection> {
    if (!this.client || !this.client.isConnected) {
      await this.connect(this.url)
    }

    return this.client.db().collection(collectionName)
  },

  map: (collection: any): any => {
    return Object.assign({}, collection, { id: collection._id })
  }

}
