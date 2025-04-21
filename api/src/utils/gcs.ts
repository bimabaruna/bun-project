import { Storage } from '@google-cloud/storage'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import path from 'path'
import { tmpdir } from 'os'

// Decode and write the GCS service account JSON
const base64 = process.env.GCS_SERVICE_ACCOUNT_BASE64
const keyPath = path.join(tmpdir(), 'gcs-service-account.json')

if (base64 && !existsSync(keyPath)) {
  const json = Buffer.from(base64, 'base64').toString('utf-8')
  writeFileSync(keyPath, json)
}

console.log('GCS initialized. Key path:', keyPath)
console.log('Exists?', existsSync(keyPath)) // should now be true

if (!existsSync(keyPath)) {
  throw new Error(`❌ GCS key file not found at ${keyPath}`)
}

const credentials = JSON.parse(readFileSync(keyPath, 'utf-8'))

const storage = new Storage({
  credentials,
  projectId: credentials.project_id,
})

export const bucketName = 'pos_image_bucket'
export const bucket = storage.bucket(bucketName)

console.log('✅ GCS initialized at:', keyPath)
