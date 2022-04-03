import wrap from '@app/helpers/jobs/wrap'
import User from '@app/models/user'
import Axios from 'axios'

export default function agendaDefineVerifyLocationForecast(agenda) {
  agenda.define('verifyLocationForecast', wrap(verifyLocationForecast))
}

// Based on https://www.weatherapi.com/docs/weather_conditions.json
const rainPossibleCodes = [
  1063, 1066, 1069, 1072, 1087, 1114, 1117, 1186, 1189, 1192, 1195, 1198, 1201,
  1204, 1207, 1210, 1240, 1243, 1246, 1249, 1252, 1273, 1276,
]

async function verifyLocationForecast() {
  const users = await User.find().lean(true)

  const usersPromises = users.map(async (user) => {
    try {
      const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHERAPI_KEY}&q=${user.location.coordinates[1]},${user.location.coordinates[0]}&days=1&aqi=no&alerts=no`
      const { data } = await Axios.get(weatherUrl)

      const dayCode = Number(data.forecast.forecastday[0].day.condition.code)
      if (rainPossibleCodes.includes(dayCode)) {
        // TODO: Send to Weni.ai api
        console.log('sending')
      }
    } catch (e) {
      // With one fails, should not stop all users
      // TODO: Send to sentry or other related platform
      console.log(`Jobs fail: `, e.isAxiosError ? e.response.data : e)
    }
  })

  await Promise.all(usersPromises)
}
