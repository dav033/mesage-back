import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { userSchema } from 'src/models/users.schema'
import { privateChatSchema } from 'src/models/privateChat.schema'
import { roomSchema } from 'src/models/room.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: userSchema }]),
    MongooseModule.forFeature([{ name: 'Rooms', schema: roomSchema }]),
    MongooseModule.forFeature([
      { name: 'PrivateChats', schema: privateChatSchema }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
