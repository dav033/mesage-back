/* eslint-disable no-useless-constructor */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Message } from 'src/types/messages.interface'

import { Room } from 'src/types/rooms.interface'
import { Users } from 'src/types/users.interface'
import { CreateRoomDto } from './dto'

interface RoomsGroup {
  room: Room
  lastMessage: Message | null
  lenghtMessages: number
  noReadedMessages: Message[] | null
}
@Injectable()
export class RoomService {
  constructor (
    @InjectModel('Users') private UsersModel: Model<Users>,
    @InjectModel('Rooms') private RoomModel: Model<Room>,
    @InjectModel('Messages') private MessagesModel: Model<Message>
  ) {}

  getRoom = async (id: string): Promise<Room> => {
    try {
      const room = await this.RoomModel.findById(id)
      if (!room) {
        throw new NotFoundException('Room not found')
      }
      return room
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  getRooms = async (): Promise<Room[]> => {
    try {
      const rooms = await this.RoomModel.find()
      if (!rooms) {
        throw new NotFoundException('Rooms not found')
      }

      return rooms
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  createRoom = async (room: CreateRoomDto): Promise<String> => {
    try {
      const newRoom = await new this.RoomModel(room)
      const id: string = await newRoom.save().then((room) => {
        return room._id
      })

      await this.UsersModel.findByIdAndUpdate(room.creator, {
        $push: { rooms: id }
      })

      return id
    } catch (error) {
      throw new InternalServerErrorException('Error creating room')
    }
  }

  getRoomsByIdGroup = async (
    idGroup: string[],
    userId: string
  ): Promise<RoomsGroup[]> => {
    try {
      let roomsAux: RoomsGroup[]
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
          roomsAux.push({
            room,
            lastMessage: null,
            lenghtMessages,
            noReadedMessages
          })
        } else {
          const lastMessage = messages[lenghtMessages - 1]
          const lastMessageData = await this.MessagesModel.findById(lastMessage)

          roomsAux.push({
            room,
            lastMessage: lastMessageData,
            lenghtMessages,
            noReadedMessages
          })
        }
      })

      return roomsAux
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  getRoomsLessTheUsersRoom = async (id: string): Promise<Room[]> => {
    try {
      const roomAux: Room[] = []

      const user: Users = await this.UsersModel.findById(id)
      const rooms: Room[] = await this.RoomModel.find()

      rooms.forEach((room) => {
        if (user.rooms.indexOf(room._id) === -1) {
          roomAux.push(room)
        }
      })

      if (!roomAux || roomAux.length === 0) {
        throw new NotFoundException('Rooms not found')
      }

      return roomAux
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error')
    }
  }

  setMessagesReaded = async (
    roomId: string,
    userId: string
  ): Promise<{ success: boolean }> => {
    try {
      const messagesRoom: Message[] = await this.MessagesModel.find({
        room: roomId
      })

      messagesRoom.forEach(async (message) => {
        const isTheUserRead: boolean = message.usersReads.includes(userId)

        if (!isTheUserRead) {
          await this.MessagesModel.findByIdAndUpdate(message._id, {
            $push: { usersReads: userId }
          })
        }
      })

      return { success: true }
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error')
    }
  }
}
