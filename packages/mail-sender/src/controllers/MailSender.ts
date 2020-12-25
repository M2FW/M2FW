import { MailSenderAuthConfig, MailSenderConfig, SenderInfo } from '../interfaces/MailSenderConfig'
import nodemailer, { SendMailOptions, SentMessageInfo, Transporter } from 'nodemailer'

export class MailSender {
  private transporter: Transporter
  private sender: SenderInfo

  constructor(config: MailSenderConfig) {
    const { host, port, secure, auth, sender, sentHandler }: MailSenderConfig = config
    const { user, password }: MailSenderAuthConfig = auth

    if (sentHandler && typeof sentHandler === 'function') this.sentHandler = sentHandler
    this.sender = sender
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass: password },
    })
  }

  public async send(receivers: string[], subject: string, content: string, sender?: SenderInfo): Promise<void> {
    try {
      if (!sender) sender = this.sender

      const mailOptions: SendMailOptions = {
        from: `"${sender.name}" <${sender.email}>`,
        to: receivers.join(', '),
        subject,
        html: content,
      }
      const sentMessageInfo: SentMessageInfo = await this.transporter.sendMail(mailOptions)
      this.sentHandler(sentMessageInfo)
    } catch (e) {
      throw e
    }
  }

  private sentHandler(sentMessageInfo: SentMessageInfo): void {
    console.log(sentMessageInfo)
  }
}
