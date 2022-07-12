/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-await */
import {
  Body,
  HttpCode,
  JsonController, Post, Put, Req,
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
import BaseCrudServices from '../../../../Shared/APIs/BaseClasses/BaseCrudServices'
import IBaseCrudController from '../../../../Shared/APIs/BaseClasses/IBaseCrudController'
import BaseResponse from '../../../../Shared/APIs/BaseClasses/Responses/BaseResponse'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { BaseRoutes } from '../../../../Shared/APIs/Enums/Routes'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import { CityDTO } from '../../../../Shared/DTOs/Locations/CityDTO'
import { CountryDTO } from '../../../../Shared/DTOs/Locations/CountryDTO'
import { StateDTO } from '../../../../Shared/DTOs/Locations/StateDTO'
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
}
