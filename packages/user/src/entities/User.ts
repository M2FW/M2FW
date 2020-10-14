import { pbkdf2, randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserInterface } from '../interfaces'

@Entity()
export class User extends BaseEntity implements UserInterface {
  // TODO: Change to get value from env
  private readonly SECRET_KEY = '195nfka109sqfjs91fmslanvls92h4ioa9fsvnx'
  // TODO: Change to get value from env
  private readonly EXPIRES_IN = '2 days'

  private readonly BYTE_LENGTH: number = 64
  private readonly ENCODING_TYPE: string = 'base64'
  private readonly ITERATIONS: number = 135934
  private readonly KEY_LENGTH = 64
  private readonly DIGEST = 'sha512'

  constructor()
  constructor(user?: User) {
    super()
    this.name = user?.name
    this.email = user?.email
    this.password = user?.password
  }

  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column()
  name?: string

  @Column()
  email?: string

  @Column()
  password?: string

  @Column()
  salt?: string

  @Column({ nullable: true })
  type?: string

  @Column({
    nullable: true,
  })
  status?: string

  @Column({ default: 0 })
  failedLoginCount?: number

  @Column({ nullable: true })
  expireDate?: Date

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  async generateSalt(): Promise<string | undefined> {
    try {
      return await new Promise((resolve, reject) => {
        randomBytes(
          this.BYTE_LENGTH,
          (err: Error | null, buf: Buffer): void => {
            if (err) reject(err)
            resolve(buf.toString(this.ENCODING_TYPE))
          }
        )
      })
    } catch (e) {
      console.error(e)
    }
  }

  async encrypt(
    password: string | undefined = this.password
  ): Promise<User | void> {
    try {
      if (!this.salt) this.salt = await this.generateSalt()

      return await new Promise((resolve, reject): void => {
        if (password && this.salt) {
          pbkdf2(
            password,
            this.salt,
            this.ITERATIONS,
            this.KEY_LENGTH,
            this.DIGEST,
            (err: Error | null, derivedKey: Buffer): void => {
              if (err) reject(err)

              this.password = derivedKey.toString(this.ENCODING_TYPE)
              resolve(this)
            }
          )
        } else if (!password) {
          throw new Error(`Password is not exists`)
        } else if (!this.salt) {
          throw new Error(`Salt is not exists`)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  async checkPwdValidity(
    email: string | undefined = this.email,
    password: string | undefined = this.password
  ): Promise<User> {
    const user: User | undefined = await User.findOne({
      select: ['id', 'name', 'email', 'password', 'salt'],
      where: { email },
    })

    if (!user) throw new Error(`Can't find user `)

    this.salt = user.salt
    await this.encrypt(password)

    if (
      user?.expireDate?.getTime() &&
      user?.expireDate?.getTime() <= Date.now()
    )
      throw new Error(`Expired usre`)

    if (user.password !== this.password)
      throw new Error(`Password doesn't match`)

    return user
  }

  signIn(): string {
    const token: string = jwt.sign(
      { id: this.id, name: this.name, email: this.email },
      this.SECRET_KEY,
      { expiresIn: this.EXPIRES_IN }
    )

    console.log(`${this.email} is signed in at ${Date.now()}`)
    return token
  }

  verify(token: string): boolean {
    try {
      if (token) {
        const decoded: User = jwt.verify(token, this.SECRET_KEY) as User
        if (decoded) {
          this.id = decoded?.id
          this.name = decoded?.name
          this.email = decoded?.email
        }

        return true
      } else {
        return false
      }
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
