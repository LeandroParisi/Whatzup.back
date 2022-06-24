/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import constants from './Configuration/constants'
import { Logger } from './Commons/Logger'
import HealthCheck from './Application/Shared/Middlewares/HealthCheck/HealthCheck'
import { createExpressServer, getMetadataArgsStorage, useContainer } from 'routing-controllers'
import UserController from './Application/Contexts/OnBoarding/Controllers/UserController/UserController'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import * as swaggerUiExpress from 'swagger-ui-express'
import ErrorHandler from './Application/Shared/Middlewares/ErrorHandler/ErrorHandler'
import Container from 'typedi'
import { useContainer as OrmUseContainer, createConnection } from 'typeorm'
import { AppDataSource } from './Infrastructure/TypeOrm/data-source'

const { defaultMetadataStorage } = require('class-transformer/cjs/storage')

export class Server {
  public App : express.Express

  private readonly Port: number = constants.PORT;

  static readonly RoutingControllersOptions = {
    controllers: [HealthCheck, UserController],
    middlewares: [ErrorHandler],
    routePrefix: '/api',
    classTransformer: true,
    defaultErrorHandler: false,
    cors: true,
  }

  public Start() {
    this.App = createExpressServer(Server.RoutingControllersOptions)
    this.SetupDI()
    this.SetupTypeOrm()
    this.ConfigureGlobalMiddlewares()

    this.GenerateApiDocumentation()

    const listen = this.App.listen(this.Port)

    Logger.info(`${constants.ENV} server running on port: ${this.Port}`)

    return listen
  }

  private SetupTypeOrm() {
    createConnection(AppDataSource.options).catch((error) => {
      Logger.error('Couldn\'t connect to the database!')
      console.log(error)
      Logger.error(error)
    })
  }

  private SetupDI() {
    useContainer(Container)
    OrmUseContainer(Container)
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
    this.App.use(morgan('dev', { skip: () => !Logger.logFile }))
  }
}
