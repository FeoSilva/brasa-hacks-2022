import { Document } from 'mongoose'

interface iUser extends Document {
  location: {
    type: string
    coordinates: number[]
  }
  zipcode: string
  address: string
  whatsapp: string
  isDangerous: boolean
  createdAt: Date
  updatedAt: Date
}

export default iUser
