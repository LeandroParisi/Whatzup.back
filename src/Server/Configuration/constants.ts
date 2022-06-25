/* eslint-disable no-shadow */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

require('dotenv/config')

const { env } = process

export enum Envs {
  LOCAL = 'local',
  DSV = 'dsv',
  PROD = 'prd',
}

export default class CONSTANTS {
  static ENV : Envs = env.NODE_ENV as Envs

  static PORT = Number(env.PORT)

  static CONNECTION_STRING : string = env.DATABASE_URL

  static ROUTE_IGNORE_PATTERN = '__IGNORE__'
}
