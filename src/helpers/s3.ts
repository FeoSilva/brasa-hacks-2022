import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'

export async function upload(buffer, title, format) {
  const Bucket = `collaboat/media/${uuid()}`

  function uploadToS3() {
    const s3bucket = new AWS.S3({
      accessKeyId: process.env.S3ACCESSKEY,
      secretAccessKey: process.env.S3SECRETKEY,
    })

    const params = {
      Bucket: Bucket,
      Key: `${title ? String(title) : uuid()}${format}`,
      Body: buffer,
    }

    return new Promise((resolve, reject) => {
      s3bucket.upload(params, function upload(err, data) {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
  }

  return uploadToS3()
}
