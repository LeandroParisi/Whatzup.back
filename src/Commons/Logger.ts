/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as logger from 'winston'
import constants from '../Configuration/constants'

const shouldLogOnFile = constants.ENV !== 'local'
const date = new Date()
const fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.log`

const transports = shouldLogOnFile
  ? [
    new logger.transports.File({ filename: `logs/${fileName}`, level: 'debug' }),
    new logger.transports.Console(),
  ]
  : [new logger.transports.Console()]

logger.configure({
  level: 'debug',
  format: logger.format.combine(
    logger.format.colorize(),
    logger.format.simple(),
  ),
  transports,
})

export class Logger {
  public static readonly logFile: boolean = shouldLogOnFile;

  public static readonly console = logger;

  public static log(...args: any[]): void {
    Logger.console.debug(Logger.formatArgs(args))
  }

  public static warn(...args: any[]): void {
    Logger.console.warn(Logger.formatArgs(args))
  }

  public static error(...args: any[]): void {
    Logger.console.error(Logger.formatArgs(args))
  }

  public static info(...args: any[]): void {
    Logger.console.info(Logger.formatArgs(args))
  }

  public static verbose(...args: any[]): void {
    Logger.console.verbose(Logger.formatArgs(args))
  }

  private static formatArgs(args: any[]): string {
    // eslint-disable-next-line prefer-destructuring
    if (args.length <= 1) args = args[0]
    return JSON.stringify(args, null, 4)
  }
}
