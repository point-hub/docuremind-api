export interface IAWSConfig {
  bucketName: string
  keyId: string
  keySecret: string
}

export const bucketName = process.env['BUCKET_NAME'] ?? ''
export const keyId = process.env['KEY_ID'] ?? ''
export const keySecret = process.env['KEY_SECRET'] ?? ''

const awsConfig: IAWSConfig = { keyId, bucketName, keySecret }

export default awsConfig
