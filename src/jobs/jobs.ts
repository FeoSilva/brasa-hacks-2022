import verifyLocationForecast from './processors/verifyLocationForecast'

export default function startJobs(agenda) {
  verifyLocationForecast(agenda)

  agenda.on('ready', async function agendaOnReady() {
    await agenda.every('10 seconds', 'verifyLocationForecast')
    agenda.start()
  })
}
