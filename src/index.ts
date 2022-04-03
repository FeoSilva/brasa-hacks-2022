import dotenv from 'dotenv'
dotenv.config()

import morgan from 'morgan'
import express from 'express'
const app = express()

import corsMiddleware from '@app/middlewares/cors'
import httpsMiddleware from '@app/middlewares/https'
import privateMiddleware from '@app/middlewares/private'
import errorMiddleware from '@app/middlewares/error'
import notFoundMiddleware from '@app/middlewares/notFound'

// API Routes
import locationFunc from '@app/routes/v1/location/:zipcode/func'

app.use(morgan('dev'))
app.use(corsMiddleware)
app.use(httpsMiddleware)
app.use(privateMiddleware)

app.get('/', (req, res) =>
  res.json({
    status: 'alive',
    now: new Date(),
  })
)
app.get('/v1/location/:zipcode', locationFunc)

app.all('*', notFoundMiddleware)

app.use('*', errorMiddleware)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000')
})
