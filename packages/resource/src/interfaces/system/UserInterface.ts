export interface UserInterface {
  id?: string
  name?: string
  email?: string
  password?: string
  salt?: string
  type?: string
  status?: string
  failedLoginCount?: number
  expireDate?: Date
  createdAt?: Date
  updatedAt?: Date
}
