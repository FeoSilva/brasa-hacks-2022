import _ from 'lodash'
import Axios from 'axios'
import NotFound from '@app/errors/NotFound'
import BadRequest from '@app/errors/BadRequest'

export default async function func(req, res) {
  try {
    const zipcode = req.params.zipcode
    const { data: address } = await Axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_MAPS_API_KEY}&components=postal_code:${zipcode}`
    )

    const latitude = _.get(address, 'results[0].geometry.location.lat', '')
    const longitude = _.get(address, 'results[0].geometry.location.lng', '')
    const formatted_address = _.get(address, 'results[0].formatted_address', '')

    if (!latitude && !longitude) {
      throw new BadRequest('Invalid zipcode')
    }

    if (!latitude) {
      throw new NotFound('Latitude not found')
    }

    if (!longitude) {
      throw new NotFound('Longitude not found')
    }

    res.send({
      zipcode: zipcode,
      latitude: latitude,
      longitude: longitude,
      address: formatted_address,
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
