export class CreateRoomDto {
  name: string
  image?: string
  creator: string
  users: string[]
  type: string
}
