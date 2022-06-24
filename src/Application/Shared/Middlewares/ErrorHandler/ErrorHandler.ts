/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Response } from 'express'
import {
  BadRequestError,
  ExpressErrorMiddlewareInterface, HttpError, Middleware,
} from 'routing-controllers'
import { Service } from 'typedi'
import { Logger } from '../../../../Commons/Logger'
import { ErrorMessages } from '../../APIs/Enums/Messages'
import { StatusCode } from '../../APIs/Enums/Status'
import ApiError from '../../Errors/ApiError'
import { ApiValidationError, IValidationError } from '../../Errors/ApiValidationError'

@Service()
@Middleware({ type: 'after' })
export default class ErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(error: Error, _request: any, response: Response, next: (err?: any) => any) : void {
    const { message, name, stack } = error

    Logger.error({ message, name, stack })

    let errorToBeSent = error as ApiError

    if (error instanceof ApiError) {
      errorToBeSent = error
    } else if (error instanceof HttpError) {
      errorToBeSent = this.FormatError(error)
    } else {
      errorToBeSent = new ApiError(StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, error)
    }

    this.SendError(errorToBeSent, response)

    next()
  }

  private SendError(errorToBeSent: ApiError, response: Response<any, Record<string, any>>) {
    if (errorToBeSent.innerError) {
      // eslint-disable-next-line no-param-reassign
      delete errorToBeSent.innerError
    }

    response.json(errorToBeSent)
  }

  private FormatError(error: HttpError) : ApiError {
    if (error instanceof BadRequestError) {
      const validationErrors = this.FormatValidationErrors(error as unknown)
      return new ApiValidationError(validationErrors, error)
    }
    return new ApiError(error.httpCode, error.message)
  }

  private FormatValidationErrors(error: any) {
    const validationErrors : IValidationError[] = error.errors.map(({ property, constraints }) => {
      const validationError : IValidationError = {
        field: property,
        errors: Object.values(constraints).join(', '),
      }

      return validationError
    })

    return validationErrors
  }
}
