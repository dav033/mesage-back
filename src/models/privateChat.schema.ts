const { Schema } = require('mongoose')

export const privateChatSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: true
    }
  ]
})
