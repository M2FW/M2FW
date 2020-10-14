import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { MenuInterface } from '../interfaces'

@Entity()
@Index('idx_menu_0', (menu: Menu) => [menu.name, menu.parentMenu], {
  unique: true,
})
@Index('idx_menu_1', (menu: Menu) => [menu.parentMenu, menu.rank], {
  unique: true,
})
@Index('idx_menu_2', (menu: Menu) => [menu.routing], {
  unique: true,
})
export class Menu extends BaseEntity implements MenuInterface {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column()
  name?: string

  @Column({ nullable: true })
  description?: string

  @Column()
  category?: string

  @Column()
  type?: string

  @Column()
  rank?: number

  @Column({ nullable: true })
  routing?: string

  @Column({ nullable: true })
  routingType?: string

  @Column({ nullable: true })
  icon?: string

  @Column({ nullable: true })
  level?: number

  @Column({ default: false })
  hiddenFlag?: boolean

  @ManyToOne(() => Menu, { nullable: true })
  @JoinColumn()
  parentMenu?: Promise<Menu>

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  constructor(id: string) {
    super()
    this.id = id
  }
}
