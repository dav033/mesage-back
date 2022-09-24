/* eslint-disable no-useless-constructor */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from 'src/types/messages.interface'
import { PrivateChat } from 'src/types/privateChats.interface'
import { Room } from 'src/types/rooms.interface'
import { Users } from 'src/types/users.interface'
import { CreatePrivateChatDto } from './dto'

interface RoomsGroup {
  room: Room
  lastMessage: Message | null
  lenghtMessages: number
  noReadedMessages: Message[] | null
}

@Injectable()
export class PrivateChatService {
  constructor (
    @InjectModel('Users') private UsersModel: Model<Users>,
    @InjectModel('Rooms') private RoomModel: Model<Room>,
    @InjectModel('PrivateChats') private PrivModel: Model<PrivateChat>,
    @InjectModel('Messages') private MessagesModel: Model<Message>
  ) {}

  getPrivateChat = async (id: string): Promise<PrivateChat> => {
    try {
      const privateChat = await this.PrivModel.findById(id)

      if (!privateChat) {
        throw new NotFoundException('Private Chat not found')
      }

      return privateChat
    } catch (err) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  getPrivatesChatByIdGroup = async (
    idGroup: string[],
    userId: string
  ): Promise<RoomsGroup[]> => {
    try {
      let chatsAux: RoomsGroup[]

      idGroup.forEach(async (roomId) => {
        const room = await this.RoomModel.findById(roomId)

        const messages = room.messages

        const messageAux: Message[] | null = []

        messages.forEach(async (message) => {
          await this.MessagesModel.findById(message).then((response) => {
            messageAux.push(response)
          })
        })

        const noReadedMessages: Message[] | null = []

        messageAux.forEach((message) => {
          const usersRead: string[] = message.usersReads

          let aux = false

          usersRead.forEach((user) => {
            if (user === userId) {
              aux = true
            }
          })

          if (!aux) {
            noReadedMessages.push(message)
          }
        })

        const lenghtMessages: number = messages.length
        if (lenghtMessages === 0) {
          chatsAux.push({
            room,
            lastMessage: null,
            lenghtMessages,
            noReadedMessages
          })
        } else {
          const lastMessage = messages[lenghtMessages - 1]
          const lastMessageData = await this.MessagesModel.findById(lastMessage)

          chatsAux.push({
            room,
            lastMessage: lastMessageData,
            lenghtMessages,
            noReadedMessages
          })
        }
      })

      return chatsAux
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  createPrivateChat = async (data: CreatePrivateChatDto): Promise<string> => {
    try {
      const newPrivateChat = new this.PrivModel(data)
      let aux: any = ''
      await newPrivateChat.save().then((chat) => {
        aux = chat
      })
      return aux
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  getOtherUserByChatId = async (
    id: string,
    chatId: string
  ): Promise<String> => {
    const chat = await this.PrivModel.findById(chatId)
    const { user1, user2 } = chat

    let aux = ''
    if ((id = user1)) {
      aux = user2
    } else {
      aux = user1
    }

    return aux
  }

  setMessagesReaded = async (
    roomId: string,
    userId: string
  ): Promise<{ success: boolean }> => {
    try {
      const messagesChat: Message[] = await this.MessagesModel.findById({
        room: roomId
      })

      messagesChat.forEach(async (message) => {
        const isTheUserRead = message.usersReads.includes(userId)

        if (!isTheUserRead) {
          await this.MessagesModel.findByIdAndUpdate(message._id, {
            $push: { usersReads: userId }
          })
        }
      })
      return { success: true }
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error')
    }
  }
}
