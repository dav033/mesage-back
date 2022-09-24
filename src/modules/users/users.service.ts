/* eslint-disable no-useless-constructor */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Users } from 'src/types/users.interface'
import { Room } from 'src/types/rooms.interface'
import { PrivateChat } from 'src/types/privateChats.interface'
import { userSession } from 'src/types/userSession.interface'
import { AuthenticateUserDto, RegisterUserDto } from './dto'
import { Express } from 'express'
const jwt = require('jsonwebtoken')
require('dotenv').config()

const s3Client = require('../../digitalOcean.config')
const { PutObjectCommand } = require('@aws-sdk/client-s3')

@Injectable()
export class UsersService {
  constructor (
    @InjectModel('Users') private UsersModel: Model<Users>,
    @InjectModel('Rooms') private RoomModel: Model<Room>,
    @InjectModel('PrivateChats') private PrivModel: Model<PrivateChat>
  ) {}

  getUsers = async (): Promise<Users[]> => {
    try {
      const users = await this.UsersModel.find()

      if (users) {
        return users
      } else {
        throw new NotFoundException('User not found')
      }
    } catch (err) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  registerUser = async (
    registerUserDto: RegisterUserDto
  ): Promise<userSession> => {
    try {
      const { userName, password, confirmPassword, email } = registerUserDto
      const users = await this.UsersModel.find()

      const user = users.find((user) => user.userName === userName)

      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match')
      } else if (
        userName === '' ||
        password === '' ||
        confirmPassword === '' ||
        email === ''
      ) {
        throw new BadRequestException('Fill all fields')
      } else if (user) {
        throw new BadRequestException('Username already exists')
      } else {
        const NewUser = new this.UsersModel(registerUserDto)

        const returnUser = await NewUser.save()

        const userForToken = {
          id: returnUser.id,
          userName: returnUser.userName,
          rooms: returnUser.rooms,
          privateChats: returnUser.privateChats,
          profileImage: returnUser.profileImage
        }

        const token = jwt.sign(userForToken, process.env.SECRET_WORD, {
          expiresIn: '5h'
        })

        const userSession = {
          user: userForToken,
          token
        }

        return userSession
      }
    } catch (err) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  getUser = async (id: string): Promise<Users> => {
    try {
      const user = await this.UsersModel.findById(id)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      return user
    } catch (err) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  login = async (
    authenticateUserDto: AuthenticateUserDto
  ): Promise<userSession> => {
    console.log(authenticateUserDto)
    const { userName, password } = authenticateUserDto
    const userDB = await this.UsersModel.findOne({ userName })
    if (!userDB) {
      throw new NotFoundException('User not found')
    } else if (password !== userDB.password) {
      throw new BadRequestException('Password is incorrect')
    } else {
      console.log(userName, password)
      const userForToken = {
        id: userDB._id,
        userName: userDB.userName,
        rooms: userDB.rooms,
        privateChats: userDB.privateChats,
        profileImage: userDB.profileImage
      }

      const token = jwt.sign(userForToken, 'secret', {
        expiresIn: '5h'
      })

      return {
        user: userForToken,
        token
      }
    }
  }

  verifyToken = async (token: string): Promise<{ message: string }> => {
    try {
      const userJwt = jwt.verify(token, process.env.SECRET_WORD)
      if (userJwt) {
        return { message: 'token valido' }
      } else {
        throw new BadRequestException('Invalid token')
      }
    } catch (err) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  getAllUsersLessOne = async (id: string): Promise<Users[]> => {
    try {
      const users = await this.UsersModel.find({ _id: { $ne: id } })

      if (users) {
        return users
      } else {
        throw new InternalServerErrorException('Internal server error')
      }
    } catch (err) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  uploadProfileImage = async (
    id: string,
    file: Express.Multer.File
  ): Promise<{ message: string }> => {
    try {
      const bucketParams = {
        Bucket: 'men',
        Body: file.buffer,
        Key: id + file.originalname,
        ACL: 'public-read'
      }
      await s3Client.send(new PutObjectCommand(bucketParams))
      const url = `${process.env.URL}${id + file.originalname}`
      console.log(url)

      await this.UsersModel.findByIdAndUpdate(id, {
        profileImage: url
      })

      return { message: 'Imagen subida' }
    } catch (err) {
      throw new InternalServerErrorException('Internal server error')
    }
  }

  revalidateUserData = async (
    id: string,
    token: string
  ): Promise<userSession> => {
    try {
      const user = await this.UsersModel.findById(id)
      if (user) {
        const userJwt = jwt.verify(token, process.env.SECRET_WORD)
        if (!userJwt) {
          throw new BadRequestException('Invalid token provided')
        }

        return {
          user: {
            id: user.id,
            userName: user.userName,
            rooms: user.rooms,
            privateChats: user.privateChats,
            profileImage: user.profileImage
          },
          token
        }
      }
    } catch (err) {}
  }

  subscribeToRoom = async (
    id: string,
    roomId: string
  ): Promise<{ message: string; succes: boolean }> => {
    try {
      const user = await this.UsersModel.findById(id)
      const room = user.rooms.find((room) => room === roomId)
      if (room) {
        return {
          message: 'Ya estas subscrito a esta sala',
          succes: false
        }
      } else {
        await this.UsersModel.findByIdAndUpdate(id, {
          $push: {
            rooms: roomId
          }
        })

        await this.RoomModel.findByIdAndUpdate(roomId, {
          $push: {
            users: id
          }
        })

        return {
          message: 'Te has subscito correctamente a esta sala',
          succes: true
        }
      }
    } catch (err) {
      throw new InternalServerErrorException('Internal server error')
    }
  }
}
