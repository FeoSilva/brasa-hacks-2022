import Axios from 'axios'

import Ocurrence from '@app/models/ocurrence'
import wrap from '@app/helpers/jobs/wrap'
import User from '@app/models/user'

export default function agendaDefineVerifyLocationForecast(agenda) {
  agenda.define('verifyLocationForecast', wrap(verifyLocationForecast))
}

// Based on https://www.weatherapi.com/docs/weather_conditions.json
const rainPossibleCodes = [
  1063, 1066, 1069, 1072, 1087, 1114, 1117, 1186, 1189, 1192, 1195, 1198, 1201,
  1204, 1207, 1210, 1240, 1243, 1246, 1249, 1252, 1273, 1276,
]

const MAX_DISTANCE_IN_METERS = 1000
const MIN_DISTANCE_IN_METERS = 0

const WENI_FLOW = '1ce08c25-5f63-4df0-b491-25431fd8ad3c'

async function verifyLocationForecast() {
  const users = await User.find().lean(true)

  const usersPromises = users.map(async (user) => {
    try {
      const inProgressOcurrenceById = await Ocurrence.findOne({
        status: 'IN_PROGRESS',
        usersIds: user._id,
      })
      if (inProgressOcurrenceById) {
        // If ocurrence by ID was found, indicates that user is already notified for this ocurrence
        // So just need to skip
        console.log('Ocurrence finded by id')
        return
      }

      const inProgressOcurrenceByLocation = await Ocurrence.findOne({
        status: 'IN_PROGRESS',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [
                user.location.coordinates[0],
                user.location.coordinates[1],
              ],
            },
            $maxDistance: MAX_DISTANCE_IN_METERS,
            $minDistance: MIN_DISTANCE_IN_METERS,
          },
        },
      })
      if (inProgressOcurrenceByLocation) {
        // If ocurrence by range location was found, indicates that user location already have an ocurrence
        // So just need to send via Whatsapp
        console.log('Ocurrence finded by location')
        await Axios.post(
          'https://new.push.al/api/v2/flow_starts.json',
          {
            flow: WENI_FLOW,
            urns: [`whatsapp:${user.whatsapp}`],
            params: {
              user,
            },
          },
          {
            headers: {
              Authorization: process.env.WENI_TOKEN,
            },
          }
        )

        inProgressOcurrenceByLocation.usersIds.push(user._id)
        await inProgressOcurrenceByLocation.save()
        return
      }

      // If none ocurrence was founded, its needed to get weather data
      // And if needed, send to whatsapp and create ocurrence
      const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&q=${user.location.coordinates[1]},${user.location.coordinates[0]}&days=1&aqi=no&alerts=no`
      const { data } = await Axios.get(weatherUrl)

      const dayCode = Number(data.forecast.forecastday[0].day.condition.code)
      if (rainPossibleCodes.includes(dayCode)) {
        console.log('Creating user first ocurrence')
        await Axios.post(
          'https://new.push.al/api/v2/flow_starts.json',
          {
            flow: WENI_FLOW,
            urns: [`whatsapp:${user.whatsapp}`],
            params: {
              user,
            },
          },
          {
            headers: {
              Authorization: process.env.WENI_TOKEN,
            },
          }
        )

        const ocurrence = new Ocurrence({
          usersIds: [user._id],
          location: user.location,
          status: 'IN_PROGRESS',
        })
        await ocurrence.save()
        return
      }
    } catch (e) {
      // With one fails, should not stop all users
      // TODO: Send to some tracking error platform
      console.log(`Jobs fail: `, e.isAxiosError ? e.response.data : e)
    }
  })

  await Promise.all(usersPromises)
}
