/* eslint-disable no-shadow */
/* eslint-disable no-return-await */
import {
  Body, Get, HttpCode, JsonController, Param, Patch, Post, Put, QueryParams, Req, UseBefore,
} from 'routing-controllers'
import Container, { Service } from 'typedi'
import { Mapper } from '../../../../../Commons/Mapper/Mapper'
import Bot, { PartialBot } from '../../../../../Domain/Entities/Bot'
import { PgTypedDbConnection } from '../../../../../Infrastructure/PgTyped/PostgresTypedDbConnection'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import { PhoneNumberRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import BaseResponse from '../../../../Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ErrorMessages, ResponseMessages } from '../../../../Shared/APIs/Enums/Messages'
import { BaseRoutes } from '../../../../Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IBaseCrudController from '../../../../Shared/APIs/Interfaces/Crud/IBaseCrudController'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../../Shared/Errors/ApiError'
import TokenAuthentication from '../../../Authentication/Middlewares/TokenAuthentication'
import ValidateUserPlanByBot from '../../Middlewares/Plans/ValidateUserPlanByBot'
import { BotServices } from './BotServices'
import CreateBotRequest, { CreateBotStepPath } from './Requests/CreateBot/CreateBotRequest'
import GetAllBotsRequestQuery from './Requests/GetAllRequest/GetAllBotsRequestQuery'
import UpdateBotRequest from './Requests/UpdateBot/UpdateBotRequestBody'

@Service()
@JsonController(`/${BaseRoutes.AccountManagementBot}`)
export default class BotController implements IBaseCrudController<Bot> {
  /**
   *
   */
  constructor(
      public Service : BotServices,
      public Repository : BotRepository,
      public PhoneNumbersRepository : PhoneNumberRepository,
  ) {
  }

  @HttpCode(StatusCode.OK)
  @Get('')
  @UseBefore(TokenAuthentication)
  public async Get(
    @QueryParams({ validate: { skipMissingProperties: true } }) query: GetAllBotsRequestQuery,
    @Req() req: IAuthenticatedRequest,
  ): Promise<Bot[]> {
    const fullQuery = Mapper.map(query, GetAllBotsRequestQuery, Bot, { extraArgs: () => ({ userId: req.user.id }) })

    const bots = await this.Service.FindAll(fullQuery)

    return bots
  }

  // TODO: Refactor to use service
  @HttpCode(StatusCode.CREATED)
  @Post('')
  @UseBefore(
    TokenAuthentication,
    Container.get(ValidateUserPlanByBot).BuildValidator({ newBot: true, requestStepsPath: CreateBotStepPath }),
  )
  public async Create(
    @Body({ validate: { skipMissingProperties: true } }) body : CreateBotRequest,
    @Req() req : IAuthenticatedRequest,
  ) : Promise<Bot> {
    const bot = Mapper.map(body, CreateBotRequest, Bot, { extraArgs: () => ({ userId: req.user.id }) })

    let insertedBot : Bot
    const self = this

    async function transaction() {
      await PgTypedDbConnection.db.tx(async (db) => {
        insertedBot = await self.Repository.Create(bot, db)

        if (body?.phoneNumbers?.length) {
          await self.PhoneNumbersRepository.TryCreateBotPhoneNumbers(body.phoneNumbers, insertedBot.id, db)
        }
      })
    }

    try {
      await transaction()
      return insertedBot
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, e)
    }
  }

  // TODO: Permitir a mudança de numeros de celular
  @HttpCode(StatusCode.OK)
  @Put('/:id')
  @UseBefore(
    TokenAuthentication,
    Container.get(ValidateUserPlanByBot).BuildValidator({ newBot: false, requestStepsPath: CreateBotStepPath, canIgnoreSteps: true }),
  )
  public async Update(
    @Body({ validate: { skipMissingProperties: true } }) body : UpdateBotRequest,
    @Req() req : IAuthenticatedRequest,
    @Param('id') botId : number,
  ) : Promise<BaseResponse> {
    const { user: { id: userId } } = req
    const botInfoToUpdate = Mapper.map(body, UpdateBotRequest, PartialBot)

    const isUpdated = await this.Service.Update({ id: botId, userId }, botInfoToUpdate, body?.phoneNumbers)

    if (isUpdated) {
      return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
    }

    throw new ApiError(StatusCode.NOT_FOUND, `Unable to find bot with id ${botId} vinculated to user ${userId}`)
  }

  @HttpCode(StatusCode.OK)
  @Patch('/deactivate/:id')
  @UseBefore(TokenAuthentication)
  public async Deactivate(
    @Req() req : IAuthenticatedRequest,
    @Param('id') botId : number,
  ) : Promise<BaseResponse> {
    const { user: { id: userId } } = req

    const exists = await this.Service.Repository.FindOne({ id: botId, userId })

    if (!exists) {
      throw new ApiError(StatusCode.NOT_FOUND, `Unable to find bot with id ${botId} vinculated to user ${userId}`)
    }

    const isUpdated = await this.Service.Deactivate(botId, { userId })

    if (isUpdated) {
      return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
    }

    return new BaseResponse(`Bot ${botId} already deactivated`)
  }

  // TODO: Validar o plano do usuario quando ele tentar ativar um bot
  @HttpCode(StatusCode.OK)
  @Patch('/activate/:id')
  @UseBefore(TokenAuthentication)
  public async Activate(
    @Req() req : IAuthenticatedRequest,
    @Param('id') botId : number,
  ) : Promise<BaseResponse> {
    const { user: { id: userId } } = req

    const exists = await this.Service.Repository.FindOne({ id: botId, userId })

    if (!exists) {
      throw new ApiError(StatusCode.NOT_FOUND, `Unable to find bot with id ${botId} vinculated to user ${userId}`)
    }

    const isUpdated = await this.Service.Activate(botId, { userId })

    if (isUpdated) {
      return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
    }

    return new BaseResponse(`Bot ${botId} already activated`)
  }
}
