/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Client } from 'pg'
import * as PostgressConnectionStringParser from 'pg-connection-string'
import { upScript } from '../../../Server/Infrastructure/Migrations/1655918532171_create-database'
import IntegratedTestsConfig from './IntegratedTestsConfig'

const {
  host, user, password, port,
} = PostgressConnectionStringParser.parse(IntegratedTestsConfig.LOCAL_POSTGRESS_URL)

const client = new Client({
  host, user, password, port: Number(port), database: IntegratedTestsConfig.TEST_DATABASE_NAME,
})

const client2 = new Client({
  host, user, password, port: Number(port), database: 'postgres',
})

class GlobalSetup {
  static async Setup() {
    await this.CreateDataBase()
  }

  static async CreateDataBase() {
    await client2.connect()
    const { rowCount } = await client2.query(`
    SELECT 'CREATE DATABASE ${IntegratedTestsConfig.TEST_DATABASE_NAME}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${IntegratedTestsConfig.TEST_DATABASE_NAME}')
    `)
    if (rowCount) {
      await client2.query(`CREATE DATABASE ${IntegratedTestsConfig.TEST_DATABASE_NAME}`)
      await client.connect()
      await client.query(upScript)
    }
    await client2.end()
    await client.end()
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
