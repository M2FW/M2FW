import { SentMessageInfo } from 'nodemailer'

export interface MailSenderAuthConfig {
  user: string
  password: string
}

export interface SenderInfo {
  name: string
  email: string
}

export interface MailSenderConfig {
  host: string
  port: number
  secure: boolean
  auth: MailSenderAuthConfig
  sender: SenderInfo
  sentHandler?: (sentMessageInfo: SentMessageInfo) => any
}
