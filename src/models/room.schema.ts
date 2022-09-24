const { Schema } = require('mongoose')

export const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  },

  type: {
    type: String
    // required: true,
  }
})
