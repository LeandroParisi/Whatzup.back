import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as PostgressConnectionStringParser from 'pg-connection-string'
import constants from '../../Configuration/constants'
import User from '../../Domain/Entities/User'

const databaseUrl : string = constants.CONNECTION_STRING
const connectionOptions = PostgressConnectionStringParser.parse(databaseUrl)

export const AppDataSource = new DataSource({
  name: constants.ENVS.LOCAL,
  type: 'postgres',
  host: connectionOptions.host,
  port: +connectionOptions.port,
  username: connectionOptions.user,
  password: connectionOptions.password,
  database: connectionOptions.database,
  synchronize: true,
  logging: false,
  entities: [User],
})
