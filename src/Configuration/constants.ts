// eslint-disable-next-line @typescript-eslint/no-unused-vars

require('dotenv/config')

const { env } = process


export default {
  ENV: env.NODE_ENV,
  PORT: Number(env.PORT),
  CONNECTION_STRING: env.DATABASE_URL,
  ENVS: {
    LOCAL: 'local',
    DSV: 'dsv',
    PROD: 'prd'
  }
}
