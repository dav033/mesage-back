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
import { SendMessageDto } from './dto'
import { MessagesService } from './messages.service'

@Controller('messages')
export class MessagesController {
  constructor (private messagesService: MessagesService) {}

  @Get(':id')
  async getMessagesByRoom (@Param('id') id: string, @Res() res) {
    const messages = await this.messagesService.getMessagesByRoom(id)
    return res.status(HttpStatus.OK).json(messages)
  }

  @Post()
  async sendMessage (@Body() sendMessageDto: SendMessageDto, @Res() res) {
    const message = await this.messagesService.sendMessage(sendMessageDto)

    return res.status(HttpStatus.OK).json(message)
  }
}
