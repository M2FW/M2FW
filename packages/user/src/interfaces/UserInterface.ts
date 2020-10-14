export interface UserInterface {
  id?: String
  name?: String
  email?: String
  password?: String
  salt?: String
  type?: String
  status?: String
  failedLoginCount?: Number
  expireDate?: Date
  createdAt?: Date
  updatedAt?: Date
}
