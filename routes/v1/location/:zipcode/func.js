const _ = require("lodash")
const axios = require("axios")
const NotFound = require("../../../../errors/NotFound")
const BadRequest = require("../../../../errors/BadRequest")

module.exports = async function (req, res) {
  try {
    const zipcode = req.params.zipcode
    const { data: address } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_MAPS_API_KEY}&components=postal_code:${zipcode}`)

    const latitude = _.get(address, "results[0].geometry.location.lat", "")
    const longitude = _.get(address, "results[0].geometry.location.lng", "")

    if(!latitude && !longitude) {
      throw new BadRequest('Invalid zipcode')
    }

    if(!latitude) {
      throw new NotFound('Latitude not found')
    }

    if(!longitude) {
      throw new NotFound('Longitude not found')
    }

    res.send({
      zipcode: zipcode,
      latitude: latitude,
      longitude: longitude
    })
  } catch (error) {
    res.status(error.statusCode || 500).send(error || "Internal server error")
  }
}
