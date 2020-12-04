export interface Query {
  [queryName: string]: (
    parentObj: any,
    param: any,
    context?: any
  ) => Promise<any> | any
}

export interface Mutation {
  [mutationName: string]: (
    parentObj: any,
    param: any,
    context?: any
  ) => Promise<any> | any
}

export interface Resolver {
  Query: Query
  Mutation: Mutation
  [prop: string]: Query
}
