import User from '@app/models/user'
import BadRequest from '@app/errors/BadRequest'

export default async function func(req, res) {
  try {
    const { whatsapp } = req.params || {}

    if (!whatsapp) {
      throw new BadRequest(`Missing whatsapp`)
    }

    const whatsappExistsInDatabase =
      (await User.countDocuments({
        whatsapp: whatsapp.replace(/\D/g, ''),
      })) > 0

    if (!whatsappExistsInDatabase) {
      throw new BadRequest(`Whatsapp '${whatsapp}' was not registered`)
    }

    res.send({
      success: true,
    })
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
