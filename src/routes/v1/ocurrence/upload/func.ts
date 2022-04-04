import FormData from 'form-data'
import BadRequest from '@app/errors/BadRequest'
import Ocurrence from '@app/models/ocurrence'
import User from '@app/models/user'
import Axios from 'axios'

const WENI_FLOW = '83e9a53c-6c44-46e7-81f6-26a7992647a8'

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

    const user = await User.findOne({
      _id: userId,
    })

    if (!user) {
      throw new BadRequest(`Invalid userId`)
    }

    // Verify file is present
    if (!file) {
      throw new BadRequest(`'file' must be present in form-data request`)
    }

    const bodyFormData = new FormData()
    bodyFormData.append('image', req.file.buffer, 'image')
    const { data } = await Axios.post(
      'http://34.219.39.10:5000/model',
      bodyFormData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${bodyFormData.getBoundary()}`,
        },
      }
    )

    await Axios.post(
      'https://new.push.al/api/v2/flow_starts.json',
      {
        flow: WENI_FLOW,
        urns: [`whatsapp:${user.whatsapp}`],
        params: {
          type: data.split(' ')[0],
        },
      },
      {
        headers: {
          Authorization: process.env.WENI_TOKEN,
        },
      }
    )

    res.send({ success: true })
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
