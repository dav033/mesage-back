import { Document } from 'mongoose'

export interface Message extends Document {
  type: string
  content: string
  createdAt: Date
  transmitter: string
  context: string
  room: string
  usersReads: string[]
  receiver?: string
}
