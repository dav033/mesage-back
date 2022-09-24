/* eslint-disable no-useless-constructor */
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from 'src/types/messages.interface'
import { PrivateChat } from 'src/types/privateChats.interface'
import { Room } from 'src/types/rooms.interface'
import { Users } from 'src/types/users.interface'
import { SendMessageDto } from './dto'

@Injectable()
export class MessagesService {
  constructor (
    @InjectModel('Users') private UsersModel: Model<Users>,
    @InjectModel('Rooms') private RoomModel: Model<Room>,
    @InjectModel('PrivateChats') private PrivModel: Model<PrivateChat>,
    @InjectModel('Messages') private MessagesModel: Model<Message>
  ) {}

  getMessagesByRoom = async (id: string): Promise<Message[]> => {
    try {
      const messages = await this.MessagesModel.find({ room: id })
      return messages
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  getMessagesByChat = async (id: string) => {
    try {
      const messages = await this.MessagesModel.find({ room: id })
      return messages
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  sendMessage = async (sendMessageDto: SendMessageDto): Promise<string> => {
    try {
      const newMessage = new this.MessagesModel(sendMessageDto)

      const { context, room, transmitter, receiver, type, content, createdAt } =
        sendMessageDto

      const saveMessage = async () => {
        let aux: any = ''

        await newMessage.save().then((message) => {
          aux = message
        })

        return aux
      }

      if (context === 'room') {
        const aux = await saveMessage()

        await this.RoomModel.findByIdAndUpdate(room, {
          $push: { messages: aux._id }
        })
        return aux
      } else if (context === 'privateChat') {
        const aux = await saveMessage()
        await this.PrivModel.findByIdAndUpdate(room, {
          $push: { messages: aux._id }
        })
        return aux
      } else if (context === 'provitionalChat') {
        const newChat = new this.PrivModel({
          user1: transmitter,
          user2: receiver,
          messages: []
        })
        let aux2 = ''
        await newChat.save().then((chat) => {
          console.log(chat)
          aux2 = chat._id
        })

        let aux: any = ''

        const NewProvisionalChatMessage = new this.MessagesModel({
          type,
          content,
          createdAt,
          transmitter,
          receiver,
          context,
          room: aux2
        })

        await NewProvisionalChatMessage.save().then((message) => {
          aux = message
        })

        await this.PrivModel.findByIdAndUpdate(aux2, {
          $push: { messages: aux._id }
        })

        await this.UsersModel.findByIdAndUpdate(transmitter, {
          $push: { privateChats: aux2 }
        })

        await this.UsersModel.findByIdAndUpdate(receiver, {
          $push: { privateChats: aux2 }
        })

        return aux
      }
    } catch (error) {
      throw new InternalServerErrorException('Internal server error')
    }
  }
}
