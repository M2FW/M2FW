import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Query {
    parent(name: String): Parent
    parents: [Parent]
    children(name: String): Children
    childrens: [Children]
  }

  type Parent {
    name: String
    age: Int
    childrens: [Children]
  }

  type Children {
    name: String
    age: Int
    parent: Parent
  }
`
