import { ConnectionOptions, connect } from 'mongoose'

export default async function mongoSetup() {
  const mongoURI = process.env.MONGO_URI

  const options: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
  const connection = await connect(mongoURI, options)
  return connection
}
