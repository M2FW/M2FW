import { createConnection as TypeormCreateConnection } from 'typeorm'
import { connections } from './connections'
import { SupportedConnection, SupportedConnectionOptions } from './types'

interface ConnectionOption {
  name?: string
  ormType: string
  options: SupportedConnectionOptions
}

export async function createConnection(
  connectionOption: ConnectionOption
): Promise<SupportedConnection> {
  connectionOption.name = connectionOption?.name || 'main'
  const conn: SupportedConnection = await connect(
    connectionOption.name,
    connectionOption
  )

  connections[connectionOption?.name || 'main'] = conn
  return conn
}

async function connect(
  name: string,
  connectionOption: ConnectionOption
): Promise<SupportedConnection> {
  switch (connectionOption?.ormType?.toLowerCase()) {
    case 'typeorm':
      return await TypeormCreateConnection({
        name,
        ...connectionOption.options,
      })

    default:
      throw new Error(
        `Orm type is not matched with expected. Supporting types are 'typeorm'`
      )
  }
}

export function getConnection(name: string = 'main'): SupportedConnection {
  if (name in connections) {
    return connections[name]
  } else {
    throw new Error(`There's no connection which is named as ${name}`)
  }
}

export { SupportedConnection, SupportedConnectionOptions }
