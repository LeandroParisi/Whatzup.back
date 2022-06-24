import createConnectionPool, { sql, ConnectionPool } from '@databases/pg'
import tables from '@databases/pg-typed'
import StaticImplements from '../../Commons/Anotations/StaticImplements'
import { Logger } from '../../Commons/Logger'
import IDbConnection from '../DbConnections/Interfaces/IDbConnection'
import DatabaseSchema from './Schemas/__generated__'
import databaseSchema from './Schemas/__generated__/schema.json'

import { types } from 'pg'

types.setTypeParser(types.builtins.INT8, (value: string) => parseInt(value, 10))

types.setTypeParser(types.builtins.FLOAT8, (value: string) => parseInt(value, 10))

types.setTypeParser(types.builtins.NUMERIC, (value: string) => parseInt(value, 10))

@StaticImplements<IDbConnection<ConnectionPool>>()
export class PgTypedDbConnection {
  static db = createConnectionPool({
    bigIntMode: 'bigint',
    onQueryStart: (_query, { text, values }) => {
      Logger.info(
        `${new Date().toISOString()} START QUERY\n${text} - ${JSON.stringify(
          values,
        )}`,
      )
    },
    onQueryResults: (_query, { text }, results) => {
      Logger.info(
        `${new Date().toISOString()} END QUERY\n${text} - ${
          results.length
        } results`,
      )
    },
    onQueryError: (_query, { text }, err) => {
      Logger.info(
        `${new Date().toISOString()} ERROR QUERY\n${text} - ${err.message}`,
      )
    },
  })

  static tables = tables<DatabaseSchema>({
    databaseSchema,
  })

  static sql = sql
}
