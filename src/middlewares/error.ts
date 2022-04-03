import _ from 'lodash'

import NotFound from '@app/errors/NotFound'
import BadRequest from '@app/errors/BadRequest'

export default function error(err, req, res, next) {
  if (!err) {
    return next()
  }

  const body = parseError(err)

  const isProduction = process.env.NODE_ENV === 'production'

  // Add stack on debug mode
  if (!isProduction) {
    body.stack = err.stack
  }

  // Apply status to response
  res.status(body.status)

  // Cleanup body if in production
  if (isProduction && body.status == 500) {
    // Prepare response to user
    body.type = 'FatalError'
    body.error =
      'Um erro inesperado aconteceu e foi enviado aos nossos desenvolvedores'
  }

  if (body.status == 500) {
    body.type = 'FatalError'
    body.error =
      'Um erro inesperado aconteceu e foi enviado aos nossos desenvolvedores'

    // TODO: Implement sentry

    console.log(err)
  }

  // Send back error
  return res.send(body)
}

function parseError(err) {
  const MappingErrors = [
    { status: 400, name: 'BadRequest', class: BadRequest },
    { status: 404, name: 'NotFound', class: NotFound },
  ]

  const errorClass = _.find(
    MappingErrors,
    (maybe) => err instanceof maybe.class
  ) || { status: 500, name: 'FatalError' }

  type parsedStack = {
    status: number
    name: string
    type: string
    error: string
    stack?: string
  }

  const parsed: parsedStack = {
    status: errorClass.status,
    name: errorClass.name,
    type: err.name,
    error: err.message,
  }

  return parsed
}
