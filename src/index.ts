import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

import cors from 'cors'

// API Routes
import locationFunc from '@app/routes/v1/location/:zipcode/func'

app.use(
  cors({
    credentials: true,
    origin: true,
  })
)
app.options('*', cors())

app.get('/', (req, res) =>
  res.json({
    status: 'alive',
    now: new Date(),
  })
)
app.get('/v1/location/:zipcode', locationFunc)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000')
})
