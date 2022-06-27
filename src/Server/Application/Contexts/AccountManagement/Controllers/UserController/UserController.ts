/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable camelcase */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-await */
import {
  Body,
  HttpCode,
  JsonController,
  Post
} from 'routing-controllers'
import { Service } from 'typedi'
import { Logger } from '../../../../../Commons/Logger'
import User from '../../../../../Domain/Entities/User'
import { PgTypedDbConnection } from '../../../../../Infrastructure/PgTyped/PostgresTypedDbConnection'
import { CityRepository } from '../../../../../Infrastructure/PgTyped/Repositories/CityRepository'
import { CountryRepository } from '../../../../../Infrastructure/PgTyped/Repositories/CountryRepository'
import { StateRepository } from '../../../../../Infrastructure/PgTyped/Repositories/StateRepository'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import BaseCrudController from '../../../../Shared/APIs/BaseClasses/BaseCrudController'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import { CityDTO } from '../../../../Shared/DTOs/Locations/CityDTO'
import { CountryDTO } from '../../../../Shared/DTOs/Locations/CountryDTO'
import { StateDTO } from '../../../../Shared/DTOs/Locations/StateDTO'
import ApiError from '../../../../Shared/Errors/ApiError'
import { CreateUserDTO } from '../../UseCases/CreateUser/DTOs/CreateUserDTO'
import CreateUserRequest from './Requests/CreateUserRequest'

@Service()
@JsonController('/account-management/user')
export default class UserController extends BaseCrudController<User> {
  /**
   *
   */
  constructor(
    private repository : UserRepository,
    private countryRepository : CountryRepository,
    private stateRepository : StateRepository,
    private cityRepository : CityRepository,
  ) {
    super(repository)
  }

  @HttpCode(StatusCode.CREATED)
  @Post()
  public async Create(@Body() body : CreateUserRequest) : Promise<User> {
    const { country, state, city } = body

    await this.CheckLocalities(country, state, city)

    const userDto = CreateUserDTO.MapFromCreateRequest(body)

    return await super.Create(userDto)
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
}
