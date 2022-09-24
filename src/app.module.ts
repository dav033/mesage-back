import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { RoomModule } from './modules/room/room.module'
import { PrivateChatModule } from './modules/private-chat/private-chat.module'
import { MessagesModule } from './modules/messages/messages.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    UsersModule,
    RoomModule,
    PrivateChatModule,
    MessagesModule,
    MongooseModule.forRoot(
      'mongodb+srv://david:clavesegura03@cluster0.61stp41.mongodb.net/?retryWrites=true&w=majority'
    )
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
