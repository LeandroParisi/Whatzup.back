/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as PostgressConnectionStringParser from 'pg-connection-string'
import pgtools from 'pgtools'
import IntegratedTestsConfig from './IntegratedTestsConfig'

const {
  host, user, password, port,
} = PostgressConnectionStringParser.parse(IntegratedTestsConfig.LOCAL_POSTGRESS_URL)

class GlobalTearDown {
  static async Setup() {
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
