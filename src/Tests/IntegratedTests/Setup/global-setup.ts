/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { sql } from '@databases/pg'
import * as PostgressConnectionStringParser from 'pg-connection-string'
import pgtools from 'pgtools'
import { upScript } from '../../../Server/Infrastructure/Migrations/1655918532171_create-database'
import { TestDbConnection } from './Fixtures/DbSetup/TestDbConnection'
import IntegratedTestsConfig from './IntegratedTestsConfig'

const {
  host, user, password, port,
} = PostgressConnectionStringParser.parse(IntegratedTestsConfig.TEST_DATABASE_NAME)

class GlobalSetup {
  static async Setup() {
    await this.CreateDataBase()
    await TestDbConnection.db.query(sql`${upScript}`)
  }

  static async CreateDataBase() {
    await pgtools.createdb(
      {
        user,
        password,
        port,
        host,
      },
      IntegratedTestsConfig.TEST_DATABASE_NAME,
      (err, res) => {
        if (err) {
          console.error(err)
          process.exit(-1)
        }
        console.log(res)
      },
    )
  }
}

module.exports = async () => {
  try {
    console.log('Setting up test environment')
    await GlobalSetup.Setup()
    console.log('Successfully set up test environment')
  } catch (error) {
    console.log('Error trying to set up test environment')
    console.log(error)
    process.exit(1)
  }
}
