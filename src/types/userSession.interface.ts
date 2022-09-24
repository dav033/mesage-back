export interface userSession {
  user: {
    id: string
    userName: string
    rooms: string[]
    privateChats: string[]
    profileImage?: string
  }
  token: string
}
