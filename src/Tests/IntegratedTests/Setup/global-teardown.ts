/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Client } from 'pg'
import * as PostgressConnectionStringParser from 'pg-connection-string'
import pgtools from 'pgtools'
import { downScript } from '../../../Server/Infrastructure/Migrations/1655918532171_create-database'
import IntegratedTestsConfig from './IntegratedTestsConfig'

const {
  host, user, password, port,
} = PostgressConnectionStringParser.parse(IntegratedTestsConfig.LOCAL_POSTGRESS_URL)

const client = new Client({
  host, user, password, port: Number(port), database: IntegratedTestsConfig.TEST_DATABASE_NAME,
})

class GlobalTearDown {
  static async Setup() {
    await client.connect()
    await client.query(downScript)
    await client.end()

    await this.DropDatabase()
  }

  static async DropDatabase() {
    await pgtools.dropdb(
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
    console.log('Closing up test environment')
    await GlobalTearDown.Setup()
    console.log('Successfully close up test environment')
  } catch (error) {
    console.log('Error trying to close up test environment')
    console.log(error)
    process.exit(1)
  }
}
