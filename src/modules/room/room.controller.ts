/* eslint-disable no-useless-constructor */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res
} from '@nestjs/common'
import { CreateRoomDto } from './dto'
import { RoomService } from './room.service'

@Controller('room')
export class RoomController {
  constructor (private roomService: RoomService) {}

  @Get(':id')
  async getRoomById (@Param('id') id: string, @Res() res) {
    const room = await this.roomService.getRoom(id)
    return res.status(HttpStatus.OK).json(room)
  }

  @Get()
  async getRooms (@Res() res) {
    const rooms = await this.roomService.getRooms()
    return res.status(HttpStatus.OK).json(rooms)
  }

  @Post()
  async createRoom (@Res() res, @Body('room') room: CreateRoomDto) {
    const response = await this.roomService.createRoom(room)
    res.status(HttpStatus.OK).json(response)
  }

  @Post('/groupId')
  async getRoomsByIdGroup (@Body() { idGroup, userId }, @Res() res) {
    const rooms = await this.roomService.getRoomsByIdGroup(idGroup, userId)

    res.status(HttpStatus.OK).json(rooms)
  }

  @Post('/user')
  async getRoomsLessTheUsersRooms (@Body() { idUser }, @Res() res) {
    const rooms = await this.roomService.getRoomsLessTheUsersRoom(idUser)

    res.status(HttpStatus.OK).json(rooms)
  }

  @Post('/updateUsersRead')
  async setMessagesReaded (@Body() { roomId, userId }, @Res() res) {
    console.log(roomId, userId)

    const response = await this.roomService.setMessagesReaded(roomId, userId)

    res.status(HttpStatus.OK).json(response)
  }
}
