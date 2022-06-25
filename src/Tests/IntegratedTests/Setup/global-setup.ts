/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Client } from 'pg'
import * as PostgressConnectionStringParser from 'pg-connection-string'
import pgtools from 'pgtools'
import { upScript } from '../../../Server/Infrastructure/Migrations/1655918532171_create-database'
import IntegratedTestsConfig from './IntegratedTestsConfig'

const {
  host, user, password, port,
} = PostgressConnectionStringParser.parse(IntegratedTestsConfig.LOCAL_POSTGRESS_URL)

const client = new Client({
  host, user, password, port: Number(port), database: IntegratedTestsConfig.TEST_DATABASE_NAME,
})

class GlobalSetup {
  static async Setup() {
    await this.CreateDataBase()

    await client.connect()
    await client.query(upScript)
    await client.end()
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
