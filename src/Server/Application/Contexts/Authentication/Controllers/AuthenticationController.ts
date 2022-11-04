import {
  Body, HttpCode, JsonController,
  Post,
} from 'routing-controllers'
import { Service } from 'typedi'
import { AccountConformityServices } from '../../../../Domain/Services/AccountConformityServices'
import AuthenticationServices from '../../../../Domain/Services/AuthenticationServices'
import { UserRepository } from '../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import BaseResponse from '../../../Shared/APIs/BaseClasses/Responses/BaseResponse'
import JwtConfig from '../Hashing/JwtConfig'
import LoginPayload from './Requests/Login/LoginPayload'

@Service()
@JsonController('/authentication')
export class AuthenticationController {
  /**
   *
   */
  constructor(
    private userRepository : UserRepository,
    private accountConformityServices : AccountConformityServices,
    private authenticationServices : AuthenticationServices,
  ) { }

  @HttpCode(200)
  @Post('/login')
  public async Login(@Body() loginReq : LoginPayload) : Promise<BaseResponse<string>> {
    const user = await this.authenticationServices.CheckUserEmailAndPassword(loginReq)

    const { email } = loginReq

    const token = JwtConfig.GenerateToken({ email, id: user.id }, JwtConfig.LongerConfig)

    return new BaseResponse('Logged in successfully', token)
  }

  @HttpCode(200)
  @Post('/validate-user')
  public async ValidateUser(@Body() loginReq : LoginPayload) : Promise<BaseResponse<string>> {
    const { email, password } = loginReq
    const user = await this.GetUser(email)

    const isValidAccount = await this.accountConformityServices.IsUserRegular(user)

    return new BaseResponse('Logged in successfully', token)
  }
}
