import { Storage } from '@google-cloud/storage'
import { Readable } from 'stream'
import { File } from 'formdata-node'
import { bucketName } from '../utils/gcs'

import path from 'path'

const keyPath = path.resolve(import.meta.dir, '../gcs-service-account.json')
console.log('Resolved Key Path:', keyPath)
const storage = new Storage({
  keyFilename: keyPath,
})
const bucket = storage.bucket(bucketName)

export class UploadService {
  static async uploadFile(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const filename = `products/${Date.now()}.${ext}`
    const gcsFile = bucket.file(filename)

    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: file.type,
      },
    })

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        console.error('Stream error:', err)
        reject(new Error('Upload failed'))
      })

      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`
        resolve(publicUrl)
      })

      const readable = Readable.fromWeb(file.stream() as any)
      readable.pipe(stream)
      console.log('GCS Bucket loaded from correct file')
    })
  }
}
