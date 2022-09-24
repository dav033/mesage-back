const { Schema } = require('mongoose')
export const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Room'
      }
    ],
    privateChats: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PrivateChat'
      }
    ],
    profileImage: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)
