import { NextFunction } from 'express'
import { Between, Equal, Like, Not, Raw } from 'typeorm'
import { QueryOperators } from '../enums'
import { ComparableValues, WhereObject } from '../interfaces'

export const baseRouterMiddleware = (
  req: any,
  _res: any,
  next: NextFunction
): void => {
  if (req.query.where) req.where = buildWhereClause(JSON.parse(req.query.where))
  if (req.query.order) req.order = JSON.parse(req.query.order)
  if (req.query.page && req.query.limit) {
    req.skip = (Number(req.query.page) - 1) * Number(req.query.limit)
    req.take = Number(req.query.limit)
  }

  next()
}

export const buildWhereClause = (conditions: Record<string, WhereObject>) => {
  let where: Record<string, any> = {}
  for (let field in conditions) {
    const condition: WhereObject = conditions[field]
    const operator: QueryOperators = condition.operator

    if (conditions[field].value instanceof Object) {
      const value: ComparableValues = <ComparableValues>condition.value
      where[field] = operatorFactory(operator, value.a, value.b)
    } else {
      const value: string | number = <string | number>condition.value
      where[field] = operatorFactory(operator, value)
    }
  }

  return where
}

export const operatorFactory: any = (
  operator: QueryOperators,
  a: any,
  b?: any
) => {
  switch (operator) {
    case QueryOperators.Equal:
      return Equal(a)

    case QueryOperators.NotEqual:
      return Not(Equal(a))

    case QueryOperators.Like:
      a = a.indexOf('%') < 0 ? `%${a}%` : a
      return Like(a)

    case QueryOperators.ILike:
      a = a.indexOf('%') < 0 ? `%${a}%` : a
      return Raw((alias: string) => `LOWER(${alias}) LIKE '${a.toLowerCase()}'`)

    case QueryOperators.NotLike:
      a = a.indexOf('%') < 0 ? `%${a}%` : a
      return Not(Like(a))

    case QueryOperators.NotILike:
      a = a.indexOf('%') < 0 ? `%${a}%` : a
      return Raw(
        (alias: string) => `LOWER(${alias}) NOT LIKE '${a.toLowerCase()}'`
      )

    case QueryOperators.LowerThanEqual:
      return Raw((alias: string) => `${alias} <= ${a}`)

    case QueryOperators.LowerThan:
      return Raw((alias: string) => `${alias} < ${a}`)

    case QueryOperators.GreaterThanEqual:
      return Raw((alias: string) => `${alias} >= ${a}`)

    case QueryOperators.GreaterThan:
      return Raw((alias: string) => `${alias} > ${a}`)

    case QueryOperators.Between:
      return Between(a, b)
  }
}
