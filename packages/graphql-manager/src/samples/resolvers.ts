interface IResolver {
  Query: { [key: string]: Function }
  [key: string]: { [key: string]: Function }
}

interface IParent {
  name: string
  age: number
  childrens?: IChildren[]
}

interface IChildren {
  parentName: string
  name: string
  age: number
}

const PARENTS: IParent[] = [
  { name: 'Jone', age: 40 },
  { name: 'Jackson', age: 38 },
  { name: 'Tommy', age: 64 }
]

const CHILDRENS: IChildren[] = [
  { parentName: 'Jone', name: 'Jane', age: 10 },
  { parentName: 'Jone', name: 'Jimmy', age: 8 },
  { parentName: 'Paul', name: 'Pawel', age: 9 },
  { parentName: 'Paul', name: 'Phillip', age: 9 },
  { parentName: 'Tommy', name: 'Thomas', age: 24 }
]

export const resolvers = {
  Query: {
    parent: (
      _prevOjb: any,
      { name }: IParent,
      _context: any,
      _info: any
    ): IParent => {
      return PARENTS.find((parent: IParent) => parent.name === name)
    },
    parents: (
      _prevOjb: any,
      _param: any,
      _context: any,
      _info: any
    ): IParent[] => {
      return PARENTS
    },
    children: (_: any, { name }: IChildren, _context: any, _info: any) => {
      return CHILDRENS.find((children: IChildren) => children.name === name)
    },
    childrens: (
      _prevOjb: any,
      _param: any,
      _context: any,
      _info: any
    ): IChildren[] => {
      return CHILDRENS
    }
  },

  Parent: {
    childrens: (
      prevObj: IParent,
      _param: any,
      _context: any,
      _info: any
    ): IChildren[] => {
      return CHILDRENS.filter(
        (children: IChildren) => prevObj.name === children.parentName
      )
    }
  },

  Children: {
    parent: (
      prevObj: IChildren,
      _param: any,
      _context: any,
      _info: any
    ): IParent => {
      return PARENTS.find(
        (parent: IParent) => parent.name === prevObj.parentName
      )
    }
  }
}
