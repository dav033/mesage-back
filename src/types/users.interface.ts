import { Document } from 'mongoose'

export interface Users extends Document {
  userName: string
  email: string
  password: string
  rooms: string[]
  privateChats: string[]
  profileImage?: string
}
