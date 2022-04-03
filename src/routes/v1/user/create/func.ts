import User from '@app/models/user'
import BadRequest from '@app/errors/BadRequest'

export default async function func(req, res) {
  try {
    const { latitude, longitude, zipcode, address, whatsapp, isDangerous } =
      req.query || {}

    if (!latitude) {
      throw new BadRequest(`Missing latitude`)
    }

    if (!longitude) {
      throw new BadRequest(`Missing longitude`)
    }

    if (!zipcode) {
      throw new BadRequest(`Missing zipcode`)
    }

    if (!whatsapp) {
      throw new BadRequest(`Missing whatsapp`)
    }

    if (!address) {
      throw new BadRequest(`Missing address`)
    }

    const user = new User({
      location: {
        coordinates: [Number(longitude), Number(latitude)],
      },
      zipcode,
      address,
      whatsapp: whatsapp.replace(/\D/g, ''),
      isDangerous: Boolean(isDangerous),
    })

    await user.save()

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
