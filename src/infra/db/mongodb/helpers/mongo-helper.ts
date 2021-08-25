import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect () {
    this.client.close()
  },

  async getCollection (collectionName: string): Promise<Collection> {
    return this.client.db().collection(collectionName)
  },

  map: (collection: any, insertedId: any): any => {
    return Object.assign({}, collection, { id: insertedId })
  }

}
