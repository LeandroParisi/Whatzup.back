/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-await */
import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import {
  Body,
  HttpCode,
  JsonController, Patch,
  Post,
  Req,
  UseBefore,
} from 'routing-controllers'
import { Service } from 'typedi'
import { Logger } from '../../../../../Commons/Logger'
import { Mapper } from '../../../../../Commons/Mapper/Mapper'
import User from '../../../../../Domain/Entities/User'
import { PgTypedDbConnection } from '../../../../../Infrastructure/PgTyped/PostgresTypedDbConnection'
import { CityRepository } from '../../../../../Infrastructure/PgTyped/Repositories/CityRepository'
import { CountryRepository } from '../../../../../Infrastructure/PgTyped/Repositories/CountryRepository'
import { StateRepository } from '../../../../../Infrastructure/PgTyped/Repositories/StateRepository'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import { default as BaseCrudController, default as BaseCrudServices } from '../../../../Shared/APIs/BaseClasses/BaseCrudServices'
import IBaseCrudController from '../../../../Shared/APIs/BaseClasses/IBaseCrudController'
import BaseResponse from '../../../../Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ErrorMessages, ResponseMessages } from '../../../../Shared/APIs/Enums/Messages'
import { BaseRoutes } from '../../../../Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import { CityDTO } from '../../../../Shared/DTOs/Locations/CityDTO'
import { CountryDTO } from '../../../../Shared/DTOs/Locations/CountryDTO'
import { StateDTO } from '../../../../Shared/DTOs/Locations/StateDTO'
import ApiError from '../../../../Shared/Errors/ApiError'
import PasswordHashing from '../../../Authentication/Hashing/PasswordHashing'
import TokenAuthentication from '../../../Authentication/Middlewares/TokenAuthentication'
import CreateUserRequest from './Requests/CreateUserRequest'

@Service()
@JsonController(`/${BaseRoutes.AccountManagementUser}`)
export default class UserController implements IBaseCrudController<User> {
  Service: BaseCrudController<User>

  /**
   *
   */
  constructor(
    private repository : UserRepository,
    private countryRepository : CountryRepository,
    private stateRepository : StateRepository,
    private cityRepository : CityRepository,
  ) {
    this.Service = new BaseCrudServices<User>(repository)
  }

  @HttpCode(StatusCode.CREATED)
  @Post()
  public async Create(@Body() body : CreateUserRequest) : Promise<User> {
    const { country, state, city } = body

    await this.CheckLocalities(country, state, city)

    const hashedPassword = await PasswordHashing.HashPassword(body.password)

    const user = Mapper.map(body, CreateUserRequest, User, { extraArgs: () => ({ hashedPassword }) })

    return await this.Service.Create(user)
  }

  private async CheckLocalities(country: CountryDTO, state: StateDTO, city: CityDTO) {
    const self = this

    async function transaction() {
      await PgTypedDbConnection.db.tx(async (db) => {
        const isCountryInserted = await self.countryRepository.FindOne({ id: country.id, iso2: country.iso2 }, db)
        const isStateInserted = await self.stateRepository.FindOne({ id: state.id, iso2: state.iso2 }, db)
        const isCityInserted = await self.cityRepository.FindOne({ id: city.id }, db)

        if (!isCountryInserted) {
          Logger.info(`Creating country ${country.name}, with ID ${country.id}`)
          await self.countryRepository.Create(country, db)
        }
        if (!isStateInserted) {
          Logger.info(`Creating state ${state.name}, with ID ${state.id}`)
          await self.stateRepository.Create(state, db)
        }
        if (!isCityInserted) {
          Logger.info(`Creating city ${city.name}, with ID ${city.id}`)
          await self.cityRepository.Create(city, db)
        }
      })
    }

    try {
      await transaction()
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, e)
    }
  }

  @HttpCode(StatusCode.OK)
  @Patch('/deactivate')
  @UseBefore(TokenAuthentication)
  public async Deactivate(
    @Req() req : IAuthenticatedRequest,
  ) : Promise<BaseResponse> {
    const { user: { id: userId } } = req
    const isUpdated = await this.Service.Deactivate(userId)

    if (isUpdated) {
      return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
    }

    throw new ApiError(StatusCode.NOT_FOUND, `Unable to find user with id ${userId}`)
  }

  @HttpCode(StatusCode.OK)
  @Patch('/activate')
  @UseBefore(TokenAuthentication)
  public async Activate(
    @Req() req : IAuthenticatedRequest,
  ) : Promise<BaseResponse> {
    const { user: { id: userId } } = req
    const isUpdated = await this.Service.Activate(userId)

    if (isUpdated) {
      return new BaseResponse(ResponseMessages.UpdatedSuccessfully)
    }

    throw new ApiError(StatusCode.NOT_FOUND, `Unable to find user with id ${userId}`)
  }

  public Update(body: any, req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, id: number): Promise<BaseResponse> {
    throw new Error('Method not implemented.')
  }
}
