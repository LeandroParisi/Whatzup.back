/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import bodyParser from 'body-parser'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import express from 'express'
import morgan from 'morgan'
import { createExpressServer, getMetadataArgsStorage, useContainer } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import * as swaggerUiExpress from 'swagger-ui-express'
import Container from 'typedi'
import BotController from './Application/Contexts/AccountManagement/Controllers/BotController/BotController'
import UserController from './Application/Contexts/AccountManagement/Controllers/UserController/UserController'
import { PostDefaultInterceptor } from './Application/Shared/APIs/Interceptors/PostDefaultInterceptor'
import ErrorHandler from './Application/Shared/Middlewares/ErrorHandler/ErrorHandler'
import HealthCheck from './Application/Shared/Middlewares/HealthCheck/HealthCheck'
import { Logger } from './Commons/Logger'
import constants from './Configuration/constants'

const { defaultMetadataStorage } = require('class-transformer/cjs/storage')

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

    this.GenerateApiDocumentation()

    const listen = this.App.listen(this.Port)

    Logger.info(`${constants.ENV} server running on port: ${this.Port}`)

    return listen
  }

  private SetupDI() {
    useContainer(Container)
  }

  private GenerateApiDocumentation() {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    })

    const storage = getMetadataArgsStorage()

    const spec = routingControllersToSpec(storage, Server.RoutingControllersOptions, {
      components: {
        schemas,
      },
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: 'A sample API',
        version: '1.0.0',
      },
    })

    this.App.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

    // Render spec on root:
    this.App.get('/', (_req, res) => {
      res.json(spec)
    })
  }

  private ConfigureGlobalMiddlewares() {
    this.App.use(bodyParser.urlencoded({ extended: true }))
    this.App.use(bodyParser.json())
    this.App.use(morgan(constants.ENV, { skip: () => !Logger.logFile }))
  }
}
