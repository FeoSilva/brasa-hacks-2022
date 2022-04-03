import { Document, Types } from 'mongoose'

interface iOcurrence extends Document {
  usersIds: Types.ObjectId[]
  location: {
    type: string
    coordinates: number[]
  }
  status: string
  createdAt: Date
  updatedAt: Date
}

export default iOcurrence
