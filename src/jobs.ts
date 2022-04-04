import Agenda from 'agenda'
import jobs from '@app/jobs/jobs'

// Load helpers into app.helper
export default async function initAgenda() {
  // Apparently agenda typing is wrong
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const agenda = new Agenda({
    db: {
      address: process.env.MONGO_URI,
      collection: 'agenda',
      options: {},
    },
    defaultLockLifetime: 1000 * 60 * 60,
    processEvery: '10 seconds',
  })
  jobs(agenda)
  // wait agenda to be ready before returning
  return new Promise((resolve) => {
    agenda.once('ready', async function resolveAgenda() {
      resolve(agenda)
    })
  })
}
