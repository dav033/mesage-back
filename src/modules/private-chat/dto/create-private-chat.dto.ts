import { Message } from 'src/types/messages.interface'

export class CreatePrivateChatDto {
  user1: string
  user2: string
  messages: Message[]
}
