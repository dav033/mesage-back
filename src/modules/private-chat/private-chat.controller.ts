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
import { PrivateChatService } from './private-chat.service'

@Controller('private-chat')
export class PrivateChatController {
  constructor (private chatService: PrivateChatService) {}

  @Get(':id')
  async getPrivateChat (@Param('id') id: string, @Res() res) {
    const privateChat = await this.chatService.getPrivateChat(id)
    res.status(HttpStatus.OK).json({ privateChat })
  }

  @Post('/groupId')
  async getPrivatesChatByIdGroup (@Body() { idGroup, userId }, @Res() res) {
    const privatesChat = await this.chatService.getPrivatesChatByIdGroup(
      idGroup,
      userId
    )

    res.status(HttpStatus.OK).json(privatesChat)
  }

  @Post()
  async createPrivateChat (@Body() data, @Res() res) {
    const response = await this.chatService.createPrivateChat(data)
    res.status(HttpStatus.OK).json(response)
  }

  @Post('otherUser/:id')
  async getOtherUserByChatId (
    @Body() { chatId },
    @Param('id') id: string,
    @Res() res
  ) {
    console.log('chatID', chatId, 'id', id)
    const response = await this.chatService.getOtherUserByChatId(id, chatId)

    res.status(HttpStatus.OK).json(response)
  }

  @Post('updateUsersRead')
  async setMessagesReaded (@Body() { roomId, userId }, @Res() res) {
    const response = await this.chatService.setMessagesReaded(roomId, userId)

    console.log('response:', response)
  }
}
