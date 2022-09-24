import { Document } from 'mongoose'

export interface PrivateChat extends Document {
  user1: string
  user2: string
  messages: string[]
}
