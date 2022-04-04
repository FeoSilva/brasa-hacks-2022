import path from 'path'
import BadRequest from '@app/errors/BadRequest'
import { upload } from '@app/helpers/s3'
import Ocurrence from '@app/models/ocurrence'

export default async function func(req, res) {
  try {
    const { file } = req

    const { uploadToken, userId } = req.query

    if (!uploadToken) {
      throw new BadRequest(`Missing uploadToken`)
    }

    if (!userId) {
      throw new BadRequest(`Missing userId`)
    }

    const ocurrence = await Ocurrence.findOne({
      uploadToken: String(uploadToken),
      usersIds: userId,
    })

    if (!ocurrence) {
      throw new BadRequest(`Invalid uploadToken or userId`)
    }

    // Verify file is present
    if (!file) {
      throw new BadRequest(`'file' must be present in form-data request`)
    }

    const ext = path.extname(file.originalname)

    const validExtensions = ['.jpeg', '.jpg', '.png']

    if (!validExtensions.includes(ext)) {
      throw new BadRequest(`Invalid extension: ${ext}`)
    }

    // eslint-disable-next-line no-async-promise-executor
    const uploadedFilePromise = new Promise(async (resolve, reject) => {
      try {
        const uploadPromise = await upload(
          file.buffer,
          `upload-${userId}-${uploadToken}`,
          ext
        )
        resolve(uploadPromise)
      } catch (err) {
        reject(err)
      }
    })

    const uploadedFile: any = await uploadedFilePromise

    res.send({ url: uploadedFile.Location })
  } catch (error) {
    const status = error.statusCode || 500
    res.status(status)

    if (status >= 500) {
      res.send(error.stack || 'Internal server error')
    } else {
      res.send(error)
    }
  }
}
