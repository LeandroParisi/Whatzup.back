/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import User from '../../../Domain/Entities/User'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import { Users as UserDbModel, Users_InsertParameters } from '../Schemas/__generated__'
import { BaseRepository } from './BaseRepository'

@Service()
export class UserRepository extends BaseRepository<User, UserDbModel, Users_InsertParameters> {
  table: TableHelper<UserDbModel, Users_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = PgTypedDbConnection.tables.users
  }
}
