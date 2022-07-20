/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-await */
import {
  Body,
  HttpCode,
  JsonController, Post, Put, Req, UseBefore,
} from 'routing-controllers'
import Container, { Service } from 'typedi'
import User, { PartialUser } from '../../../../../Domain/Entities/User'
import { Mapper } from '../../../../../Setup/Mapper/Mapper'
import BaseResponse from '../../../../Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ResponseMessages } from '../../../../Shared/APIs/Enums/Messages'
import { BaseRoutes } from '../../../../Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import { IBaseCrudController } from '../../../../Shared/APIs/Interfaces/Crud/IBaseCrudController'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import PasswordHashing from '../../../Authentication/Hashing/PasswordHashing'
import TokenAuthentication from '../../../Authentication/Middlewares/TokenAuthentication'
import ValidateNewUserPlan from '../../Middlewares/Plans/ValidateNewUserPlan'
import CreateUserRequest from './Requests/CreateUserRequest'
import UpdateUserRequest, { UpdateUserPlanIdPath } from './Requests/UpdateUserRequest'
import { UserServices } from './UserServices'

@Service()
@JsonController(`/${BaseRoutes.AccountManagementUser}`)
export default class UserController implements IBaseCrudController<User, UserServices> {
  /**
   *
   */
  constructor(
    public Service : UserServices,
  ) {
  }

  @HttpCode(StatusCode.CREATED)
  @Post()
  public async Create(@Body({ validate: true }) body : CreateUserRequest) : Promise<User> {
    const {
      phoneNumber,
    } = body
    const hashedPassword = await PasswordHashing.HashPassword(body.password)

    const user = Mapper.map(body, CreateUserRequest, User, { extraArgs: () => ({ hashedPassword }) })

    const insertedUser = await this.Service.Create(user, {
      phoneNumber,
    })

    return insertedUser
  }

  @HttpCode(StatusCode.OK)
  @Put('')
  @UseBefore(
    TokenAuthentication,
    Container.get(ValidateNewUserPlan)
      .BuildValidator({ requestPlanIdPath: UpdateUserPlanIdPath, maySkipValidation: true }),
  )
  public async Update(
    @Body({ validate: { skipMissingProperties: true } }) body: UpdateUserRequest,
    @Req() req: IAuthenticatedRequest,
  ): Promise<BaseResponse> {
    const {
      phoneNumber,
    } = body
    const userUpdateInfo = Mapper.map(body, UpdateUserRequest, PartialUser)

    await this.Service.Update({ id: req.user.id }, userUpdateInfo, {
      phoneNumber,
    })

    return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
  }

  Get(_query: any, _req: IAuthenticatedRequest): Promise<User[]> {
    throw new Error('Method not implemented.')
  }
}
