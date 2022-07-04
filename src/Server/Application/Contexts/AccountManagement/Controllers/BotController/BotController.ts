/* eslint-disable no-return-await */
import {
  Body, HttpCode, JsonController, Param, Patch, Post, Put, Req, UseBefore,
} from 'routing-controllers'
import { Service } from 'typedi'
import { Mapper } from '../../../../../Commons/Mapper/Mapper'
import Bot from '../../../../../Domain/Entities/Bot'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import BaseCrudController from '../../../../Shared/APIs/BaseClasses/BaseCrudServices'
import IBaseCrudController from '../../../../Shared/APIs/BaseClasses/IBaseCrudController'
import BaseResponse from '../../../../Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ResponseMessages } from '../../../../Shared/APIs/Enums/Messages'
import { BaseRoutes } from '../../../../Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../../Shared/Errors/ApiError'
import TokenAuthentication from '../../../Authentication/Middlewares/TokenAuthentication'
import ValidateUserPlan from '../../Middlewares/Plans/ValidateUserPlan'
import CreateBotRequest, { CreateBotStepPath } from './Requests/CreateBot/CreateBotRequest'
import UpdateBotRequest from './Requests/UpdateBot/UpdateBotRequestBody'

@Service()
@JsonController(`/${BaseRoutes.AccountManagementBot}`)
export default class BotController implements IBaseCrudController<Bot> {
  Service : BaseCrudController<Bot>

  /**
   *
   */
  constructor(
      private repository : BotRepository,
  ) {
    this.Service = new BaseCrudController<Bot>(repository)
  }

  @HttpCode(StatusCode.CREATED)
  @Post('')
  @UseBefore(TokenAuthentication, ValidateUserPlan({ bot: { newBot: true, requestStepsPath: CreateBotStepPath } }))
  public async Create(
    @Body({ validate: { skipMissingProperties: true } }) body : CreateBotRequest,
    @Req() req : IAuthenticatedRequest,
  ) : Promise<Bot> {
    const bot = Mapper.map(body, CreateBotRequest, Bot, { extraArgs: () => ({ userId: req.user.id }) })
    const insertedBot = await this.Service.Create(bot)

    return insertedBot
  }

  @HttpCode(StatusCode.OK)
  @Put('/:id')
  @UseBefore(TokenAuthentication, ValidateUserPlan({ bot: { newBot: false, requestStepsPath: CreateBotStepPath } }))
  public async Update(
    @Body({ validate: { skipMissingProperties: true } }) body : UpdateBotRequest,
    @Req() req : IAuthenticatedRequest,
    @Param('id') botId : number,
  ) : Promise<BaseResponse> {
    const { user: { id: userId } } = req
    const bot = Mapper.map(body, UpdateBotRequest, Bot)
    const isUpdated = await this.Service.Update({ id: botId, userId }, bot)

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
    const isUpdated = await this.Service.Deactivate(botId, { userId })

    if (isUpdated) {
      return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
    }

    throw new ApiError(StatusCode.NOT_FOUND, `Unable to find bot with id ${botId} vinculated to user ${userId}`)
  }

  @HttpCode(StatusCode.OK)
  @Patch('/activate/:id')
  @UseBefore(TokenAuthentication)
  public async Activate(
    @Req() req : IAuthenticatedRequest,
    @Param('id') botId : number,
  ) : Promise<BaseResponse> {
    const { user: { id: userId } } = req
    const isUpdated = await this.Service.Activate(botId, { userId })

    if (isUpdated) {
      return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
    }

    throw new ApiError(StatusCode.NOT_FOUND, `Unable to find bot with id ${botId} vinculated to user ${userId}`)
  }
}
