/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-await */
import { Transaction } from '@databases/pg'
import {
  Body,
  HttpCode,
  JsonController, Post, Put, Req
} from 'routing-controllers'
import { Service } from 'typedi'
import { Logger } from '../../../../../Commons/Logger'
import { Mapper } from '../../../../../Commons/Mapper/Mapper'
import { CityDTO } from '../../../../../Domain/DTOs/Locations/CityDTO'
import { CountryDTO } from '../../../../../Domain/DTOs/Locations/CountryDTO'
import { StateDTO } from '../../../../../Domain/DTOs/Locations/StateDTO'
import { PhoneNumberDTO } from '../../../../../Domain/DTOs/PhoneNumberDTO'
import User from '../../../../../Domain/Entities/User'
import { PgTypedDbConnection } from '../../../../../Infrastructure/PgTyped/PostgresTypedDbConnection'
import { CityRepository } from '../../../../../Infrastructure/PgTyped/Repositories/CityRepository'
import { CountryRepository } from '../../../../../Infrastructure/PgTyped/Repositories/CountryRepository'
import { PhoneNumberRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import { StateRepository } from '../../../../../Infrastructure/PgTyped/Repositories/StateRepository'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import BaseCrudServices from '../../../../Shared/APIs/BaseClasses/BaseCrudServices'
import BaseResponse from '../../../../Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { BaseRoutes } from '../../../../Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IBaseCrudController from '../../../../Shared/APIs/Interfaces/Crud/IBaseCrudController'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../../Shared/Errors/ApiError'
import PasswordHashing from '../../../Authentication/Hashing/PasswordHashing'
import CreateUserRequest from './Requests/CreateUserRequest'
import UpdateUserRequest from './Requests/UpdateUserRequest'

@Service()
@JsonController(`/${BaseRoutes.AccountManagementUser}`)
export default class UserController implements IBaseCrudController<User> {
  Service: BaseCrudServices<User>

  /**
   *
   */
  constructor(
    private repository : UserRepository,
    private countryRepository : CountryRepository,
    private stateRepository : StateRepository,
    private cityRepository : CityRepository,
    private phoneNumberRepository : PhoneNumberRepository,
  ) {
    this.Service = new BaseCrudServices<User>(repository)
  }

  @HttpCode(StatusCode.CREATED)
  @Post()
  public async Create(@Body({ validate: true }) body : CreateUserRequest) : Promise<User> {
    const {
      country, state, city, phoneNumber,
    } = body

    const phoneNumberId = await this.UpsertUserDependencies(country, state, city, phoneNumber)

    const hashedPassword = await PasswordHashing.HashPassword(body.password)

    const user = Mapper.map(body, CreateUserRequest, User, { extraArgs: () => ({ hashedPassword, phoneNumberId }) })

    return await this.Service.Repository.Create(user)
  }

  @HttpCode(StatusCode.OK)
  @Put('')
  // @UseBefore(TokenAuthentication, ValidateUserPlanBuilder({ newUserPlan: true }))
  public Update(
    @Body({ validate: { skipMissingProperties: true } }) _body: UpdateUserRequest,
    @Req() _req: IAuthenticatedRequest,
  ): Promise<BaseResponse> {
    // const { country, state, city } = body

    throw new Error('Method not implemented.')
  }

  Get(_query: any, _req: IAuthenticatedRequest): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  public Deactivate(
    @Req() _req : IAuthenticatedRequest,
  ) : Promise<BaseResponse> {
    throw new Error('Method not implemented.')
  }

  public Activate(
    @Req() _req : IAuthenticatedRequest,
  ) : Promise<BaseResponse> {
    throw new Error('Method not implemented.')
  }

  private async UpsertUserDependencies(
    country: CountryDTO, state: StateDTO, city: CityDTO, phoneNumber: PhoneNumberDTO,
  ) : Promise<number> {
    const self = this
    let phoneNumberId : number = null

    async function transaction() {
      await PgTypedDbConnection.db.tx(async (db) => {
        await self.UpsertLocalities(country, state, city, db)
        const { id } = await self.phoneNumberRepository.Create(phoneNumber)
        phoneNumberId = id
      })
    }

    try {
      await transaction()
      return phoneNumberId
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, e)
    }
  }

  private async UpsertLocalities(country: CountryDTO, state: StateDTO, city: CityDTO, transaction : Transaction) {
    const isCountryInserted = await this.countryRepository.FindOne({ id: country.id, iso2: country.iso2 }, transaction)
    const isStateInserted = await this.stateRepository.FindOne({ id: state.id, iso2: state.iso2 }, transaction)
    const isCityInserted = await this.cityRepository.FindOne({ id: city.id }, transaction)

    if (!isCountryInserted) {
      Logger.info(`Creating country ${country.name}, with ID ${country.id}`)
      await this.countryRepository.Create(country, transaction)
    }
    if (!isStateInserted) {
      Logger.info(`Creating state ${state.name}, with ID ${state.id}`)
      await this.stateRepository.Create(state, transaction)
    }
    if (!isCityInserted) {
      Logger.info(`Creating city ${city.name}, with ID ${city.id}`)
      await this.cityRepository.Create(city, transaction)
    }
  }
}
