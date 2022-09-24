import { Schema } from 'mongoose'
export const MessageSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
    //  default: Date.now
  },
  transmitter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  context: {
    type: String,
    required: true
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },
  usersReads: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})
