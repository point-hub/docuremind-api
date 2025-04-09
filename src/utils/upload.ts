import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import awsConfig from '@/config/aws'

// Create an S3 client
const s3 = new S3Client({
  endpoint: 'https://s3.us-west-004.backblazeb2.com',
  region: 'us-west-004',
  credentials: {
    accessKeyId: awsConfig.keyId,
    secretAccessKey: awsConfig.keySecret,
  },
  forcePathStyle: true,
})

// Create a bucket and upload something into it
const bucketName = awsConfig.bucketName

export const uploadFile = async (filename: string, buffer: Buffer) => {
  const bucketParams = {
    Bucket: bucketName,
    Key: filename,
    Body: buffer,
    ContentDisposition: 'inline',
    ContentType: 'application/pdf',
  }

  if (filename.endsWith('pdf')) {
    bucketParams.ContentType = 'application/pdf'
  } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
    bucketParams.ContentType = 'image/jpeg'
  } else if (filename.endsWith('.png')) {
    bucketParams.ContentType = 'image/png'
  }

  try {
    const data = await s3.send(new PutObjectCommand(bucketParams))
    console.log('Success', data)
  } catch (err) {
    console.log('Error', err)
  }
}

export const getFile = async (filename: string) => {
  if (filename === 'undefined' || !filename) {
    return ''
  }
  // Create the S3 command to get the object
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: filename,
  })

  try {
    const presigned = await getSignedUrl(s3, command, {
      expiresIn: 60 * 60, // 1 hour
    })

    console.log('Success', presigned)
    return presigned
  } catch (err) {
    console.log('Error', err)
  }
}
