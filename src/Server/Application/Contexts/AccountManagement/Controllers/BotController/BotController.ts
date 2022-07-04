/* eslint-disable no-return-await */
import {
  Body, HttpCode, JsonController, Param, Post, Put, Req, UseBefore,
} from 'routing-controllers'
import { Service } from 'typedi'
import { Mapper } from '../../../../../Commons/Mapper/Mapper'
import Bot from '../../../../../Domain/Entities/Bot'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import BaseCrudController from '../../../../Shared/APIs/BaseClasses/BaseCrudController'
import BaseResponse from '../../../../Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ResponseMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../../Shared/Errors/ApiError'
import TokenAuthentication from '../../../Authentication/Middlewares/TokenAuthentication'
import ValidateUserPlan from '../../Middlewares/Plans/ValidateUserPlan'
import CreateBotRequest, { CreateBotStepPath } from './Requests/CreateBot/CreateBotRequest'
import UpdateBotRequest from './Requests/UpdateBot/UpdateBotRequestBody'

@Service()
@JsonController('/account-management/bot')
export default class BotController extends BaseCrudController<Bot> {
  /**
   *
   */
  constructor(
      private repository : BotRepository,
  ) {
    super(repository)
  }

  @HttpCode(StatusCode.CREATED)
  @Post('')
  @UseBefore(TokenAuthentication, ValidateUserPlan({ bot: { newBot: true, requestStepsPath: CreateBotStepPath } }))
  public async CreateBot(
    @Body({ validate: { skipMissingProperties: true } }) body : CreateBotRequest,
    @Req() req : IAuthenticatedRequest,
  ) : Promise<Bot> {
    const bot = Mapper.map(body, CreateBotRequest, Bot, { extraArgs: () => ({ userId: req.user.id }) })
    const insertedBot = await super.Create(bot)

    return insertedBot
  }

  @HttpCode(StatusCode.OK)
  @Put('/:id')
  @UseBefore(TokenAuthentication, ValidateUserPlan({ bot: { newBot: false, requestStepsPath: CreateBotStepPath } }))
  public async UpdateBot(
    @Body({ validate: { skipMissingProperties: true } }) body : UpdateBotRequest,
    @Req() req : IAuthenticatedRequest,
    @Param('id') botId : number,
  ) : Promise<BaseResponse> {
    const { user: { id: userId } } = req
    const bot = Mapper.map(body, UpdateBotRequest, Bot)
    const isUpdated = await super.Update({ id: botId, userId }, bot)

    if (isUpdated) {
      return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
    }

    throw new ApiError(StatusCode.NOT_FOUND, `Unable to find bot with id ${botId} vinculated to user ${userId}`)
  }
}
