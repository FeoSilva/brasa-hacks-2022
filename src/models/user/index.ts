import iUser from './interface'
import { Schema, Model, model } from 'mongoose'

export const UserSchema = new Schema<iUser>(
  {
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },

    zipcode: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    whatsapp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

const UserModel = model('user', UserSchema, 'user') as Model<iUser>

export default UserModel
