import { Module } from '@nestjs/common'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { MongooseModule } from '@nestjs/mongoose'
import { privateChatSchema } from 'src/models/privateChat.schema'
import { roomSchema } from 'src/models/room.schema'
import { userSchema } from 'src/models/users.schema'
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
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}
