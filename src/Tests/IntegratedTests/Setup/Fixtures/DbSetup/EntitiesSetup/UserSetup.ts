/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { sql } from '@databases/pg'
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import User from '../../../../../../Server/Domain/Entities/User'
import {
  Users as UserDbModel,
  Users_InsertParameters,
} from '../../../../../../Server/Infrastructure/PgTyped/Schemas/__generated__'
import { TestDbConnection } from '../TestDbConnection'
import { BaseEntitySetup } from './BaseEntitySetup'

@Service()
export class UserSetup extends BaseEntitySetup<User, UserDbModel, Users_InsertParameters> {
  table: TableHelper<UserDbModel, Users_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = TestDbConnection.tables.users
  }

  async PreCleanUp(entity: User): Promise<void> {
    await TestDbConnection.db.query(sql`DELETE FROM users_bots WHERE user_id = ${entity.id}`)
  }
}
