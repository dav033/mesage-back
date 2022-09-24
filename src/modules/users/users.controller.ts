/* eslint-disable no-useless-constructor */
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Param,
  Headers,
  UseInterceptors,
  UploadedFile,
  HttpStatus
} from '@nestjs/common'
import { Users } from 'src/types/users.interface'
import { UsersService } from './users.service'
import { AuthenticateUserDto, RegisterUserDto } from './dto'
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
require('dotenv').config()

@Controller('users')
export class UsersController {
  constructor (private usersService: UsersService) {}

  @Get()
  async getUsers (@Res() res): Promise<Users[]> {
    const users = await this.usersService.getUsers()
    return res.status(HttpStatus.OK).json(users)
  }

  @Post('/register')
  async registerUser (@Res() res, @Body() registerUserDto: RegisterUserDto) {
    const userSession = await this.usersService.registerUser(registerUserDto)

    res.status(HttpStatus.OK).json(userSession)
  }

  @Get(':id')
  async getUserById (@Res() res, @Param('id') id: string) {
    const user = await this.usersService.getUser(id)
    res.status(HttpStatus.OK).json(user)
  }

  @Post('/login')
  async login (@Res() res, @Body() authenticateUserDto: AuthenticateUserDto) {
    const userSession = await this.usersService.login(authenticateUserDto)
    res.status(HttpStatus.OK).json(userSession)
  }

  @Post('/token')
  async verifyToken (@Headers('Authorization') Authorization, @Res() res) {
    const token = Authorization.split(' ')[1]

    const response = await this.usersService.verifyToken(token)

    res.status(HttpStatus.OK).json(response)
  }

  @Get('/allUsers/:id')
  async getAllUsersLessOne (@Param('id') id: string, @Res() res) {
    const users = await this.usersService.getAllUsersLessOne(id)

    res.status(HttpStatus.OK).json(users)
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage (
    @UploadedFile('file') file: Express.Multer.File,
    @Param('id') id: string,
    @Res() res
  ) {
    const response = await this.usersService.uploadProfileImage(id, file)

    res.status(HttpStatus.OK).json(response)
  }

  @Get('/revalidate/:id')
  async revalidateUserData (
    @Param('id') id: string,
    @Res() res,
    @Headers('Authorization') Authorization: string
  ) {
    const token = Authorization.split(' ')[1]

    const user = await this.usersService.revalidateUserData(id, token)
    res.status(HttpStatus.OK).json(user)
  }

  @Post(':id/subscribe')
  async subscribeToRoom (
    @Param('id') id: string,
    @Body('roomId') roomId: string,
    @Res() res
  ) {
    const response = await this.usersService.subscribeToRoom(id, roomId)

    if (response.succes === true) {
      return res.status(HttpStatus.OK).json(response.succes)
    } else {
      return res.status(HttpStatus.NOT_ACCEPTABLE).json(response)
    }
  }
}
