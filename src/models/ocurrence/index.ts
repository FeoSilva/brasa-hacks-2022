import iOcurrence from './interface'
import { Schema, Model, model } from 'mongoose'

export const OcurrenceSchema = new Schema<iOcurrence>(
  {
    usersIds: {
      type: Schema.Types.ObjectId,
    },

    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },

    status: {
      type: String,
      required: true,
      enum: ['IN_PROGRESS', 'FINISHED'],
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

OcurrenceSchema.index({ location: '2dsphere' })

const OcurrenceModel = model(
  'ocurrence',
  OcurrenceSchema,
  'ocurrence'
) as Model<iOcurrence>

export default OcurrenceModel
