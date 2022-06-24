import { ExpressMiddlewareInterface } from 'routing-controllers'
import { Roles } from '../../../../Domain/Enums/Roles'
import { ErrorMessages } from '../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import JwtConfig from '../Hashing/JwtConfig'
import IUserToken from '../Interfaces/IUserToken'
import ApiError from '../../../Shared/Errors/ApiError'

require('dotenv/config')

export default class AuthenticateUser implements ExpressMiddlewareInterface {
  public use(req: IAuthenticatedRequest, response: any, next: (err?: any) => any) {
    const auth = req.get('auth')

    try {
      const userData = JwtConfig.Decode(auth).userData as IUserToken

      if (userData.role !== Roles.admin) {
        throw new ApiError(StatusCode.UNAUTHORIZED, ErrorMessages.Unauthorized)
      }

      req.user = { ...userData }
      next()
    } catch (error) {
      throw new ApiError(StatusCode.UNAUTHORIZED, ErrorMessages.ExpiredSession)
    }
  }
}
