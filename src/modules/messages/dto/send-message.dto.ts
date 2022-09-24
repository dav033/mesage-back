export class SendMessageDto {
  type: string
  content: string
  createdAt: Date
  transmitter: string
  context: string
  room: string
  usersReads: string[]
  receiver?: string
}
