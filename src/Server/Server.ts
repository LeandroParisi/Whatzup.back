/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import bodyParser from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import { createExpressServer, useContainer } from 'routing-controllers'
import Container from 'typedi'
import BotController from './Application/Contexts/AccountManagement/Controllers/BotController/BotController'
import UserController from './Application/Contexts/AccountManagement/Controllers/UserController/UserController'
import { PostDefaultInterceptor } from './Application/Shared/APIs/Interceptors/PostDefaultInterceptor'
import ErrorHandler from './Application/Shared/Middlewares/ErrorHandler/ErrorHandler'
import HealthCheck from './Application/Shared/Middlewares/HealthCheck/HealthCheck'
import { Logger } from './Commons/Logger'
import constants from './Configuration/constants'
import GenerateApiDocumentation from './Setup/GenerateApiDocumentation'

export class Server {
  public App : express.Express

  private readonly Port: number = constants.PORT;

  static readonly RoutingControllersOptions = {
    controllers: [HealthCheck, UserController, BotController],
    middlewares: [ErrorHandler],
    interceptors: [PostDefaultInterceptor],
    routePrefix: '/api',
    classTransformer: true,
    defaultErrorHandler: false,
    cors: true,
  }

  public Start() {
    this.App = createExpressServer(Server.RoutingControllersOptions)

    this.SetupDI()

    this.ConfigureGlobalMiddlewares()

    GenerateApiDocumentation.Generate(this.App, Server.RoutingControllersOptions)
  }

  public Run() {
    const listen = this.App.listen(this.Port)

    Logger.info(`${constants.ENV} server running on port: ${this.Port}`)

    return listen
  }

  private SetupDI() {
    useContainer(Container)
  }

  private ConfigureGlobalMiddlewares() {
    this.App.use(bodyParser.urlencoded({ extended: true }))
    this.App.use(bodyParser.json())
    this.App.use(morgan(constants.ENV, { skip: () => !Logger.logFile }))
  }
}
