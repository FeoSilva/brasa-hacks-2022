import BadRequest from '@app/errors/BadRequest'

export default async function privateMiddleware(req, res, next) {
  try {
    const expectedSecret = process.env.SECRET
    const secret = req.query.secret

    if (!secret) {
      throw new BadRequest(`Missing secret`)
    }

    if (secret !== expectedSecret) {
      throw new BadRequest(`Invalid secret`)
    }

    return next()
  } catch (err) {
    next(err)
  }
}
