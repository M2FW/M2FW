import {
  BaseController,
  FindOptions,
  ListResult,
  QueryCondition,
} from '../interfaces'
import {
  DeleteResult,
  EntityManager,
  InsertResult,
  ObjectType,
  UpdateResult,
} from 'typeorm'

import { getConnection } from '@m2fw/datasource'

export abstract class AbstractBaseController<T> implements BaseController<T> {
  entity: ObjectType<T>

  constructor(entity: ObjectType<T>) {
    if (!entity) throw new Error(`entity is not defiend.`)
    this.entity = entity
  }

  public async findById(
    id: string | number,
    findOptions?: FindOptions<T>
  ): Promise<T | void> {
    return await getConnection()
      .getRepository(this.entity)
      .findOne(id, findOptions)
  }

  public async findOne(
    queryCondition?: QueryCondition<T> | string
  ): Promise<T | undefined> {
    return await getConnection()
      .getRepository(this.entity)
      .findOne(queryCondition as any)
  }

  public async find(
    queryCondition?: QueryCondition<T>
  ): Promise<ListResult<T>> {
    const result: [T[], number] = await getConnection()
      .getRepository(this.entity)
      .findAndCount(queryCondition)

    return {
      items: result[0],
      total: result[1],
    }
  }

  public async insert(data: T | T[]): Promise<InsertResult | InsertResult[]> {
    return await getConnection().getRepository(this.entity).insert(data)
  }

  public async update(data: T | T[]): Promise<UpdateResult | UpdateResult[]> {
    if (data instanceof Array) {
      return await getConnection().transaction(
        async (trxMgr: EntityManager) => {
          return await Promise.all(
            data.map(
              async (item: any) =>
                await trxMgr.getRepository(this.entity).update(item.id, item)
            )
          )
        }
      )
    } else {
      return await getConnection()
        .getRepository(this.entity)
        .update((data as any).id, data)
    }
  }

  public async delete(
    data: string | number | string[] | number[]
  ): Promise<DeleteResult> {
    return await getConnection().getRepository(this.entity).delete(data)
  }
}
