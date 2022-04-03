export default function wrapAgendaJob(fn) {
  return async (job, done) => {
    try {
      job.attrs.result = await fn(job.attrs.data)

      done()
    } catch (e) {
      done(e)
    }
  }
}
