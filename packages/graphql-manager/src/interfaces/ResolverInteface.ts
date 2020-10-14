export interface QueryInterface {
  [queryName: string]: (
    parentObj: any,
    param: any,
    context?: any
  ) => Promise<any> | any
}

export interface MutationInterface {
  [mutationName: string]: (
    parentObj: any,
    param: any,
    context?: any
  ) => Promise<any> | any
}

export interface ResolverInterface {
  Query: QueryInterface
  Mutation: MutationInterface
  [prop: string]: QueryInterface
}
