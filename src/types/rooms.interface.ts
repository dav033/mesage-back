import { Document } from 'mongoose'

export interface Room extends Document {
  name: string
  image?: string
  creator: string
  users: string[]
  messages: string[]
  createdAt: Date
  type: string
}
