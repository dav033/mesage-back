import { Module } from '@nestjs/common'
import { PrivateChatController } from './private-chat.controller'
import { PrivateChatService } from './private-chat.service'
import { MongooseModule } from '@nestjs/mongoose'
import { userSchema } from 'src/models/users.schema'
import { privateChatSchema } from 'src/models/privateChat.schema'
import { roomSchema } from 'src/models/room.schema'
import { MessageSchema } from 'src/models/message.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: userSchema }]),
    MongooseModule.forFeature([{ name: 'Rooms', schema: roomSchema }]),
    MongooseModule.forFeature([
      { name: 'PrivateChats', schema: privateChatSchema }
    ]),
    MongooseModule.forFeature([{ name: 'Messages', schema: MessageSchema }])
  ],
  controllers: [PrivateChatController],
  providers: [PrivateChatService]
})
export class PrivateChatModule {}
