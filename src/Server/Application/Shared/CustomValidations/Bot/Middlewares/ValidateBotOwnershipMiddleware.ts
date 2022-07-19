/* eslint-disable @typescript-eslint/no-unsafe-call */
/* istanbul ignore file */
import { NextFunction, Response } from 'express'
import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Service } from 'typedi'
import { BotRepository } from '../../../../../Infrastructure/PgTyped/Repositories/BotRepository'
import { ErrorMessages } from '../../../APIs/Enums/Messages'
import { StatusCode } from '../../../APIs/Enums/Status'
import IAuthenticatedRequest from '../../../APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../Errors/ApiError'

@Service()
export default class ValidateBotOwnershipMiddleware implements ExpressMiddlewareInterface {
  /**
   *
   */
  constructor(
    private botRepository : BotRepository,
  ) {}

  async use(req: IAuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req?.user?.id) {
      throw new ApiError(
        StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, new Error("'This route requires authentication'"),
      )
    }

    const { id: botId } = req.params
    const { user: { id: userId } } = req

    if (!botId) {
      throw new ApiError(StatusCode.BAD_REQUEST, 'Bot id must be present on route params')
    }

    const exists = await this.botRepository.FindOne({ id: Number(botId), userId })

    if (exists) {
      next()
    } else {
      throw new ApiError(StatusCode.NOT_FOUND, `Unable to find bot with id ${botId} vinculated to user ${userId}`)
    }
  }
}
