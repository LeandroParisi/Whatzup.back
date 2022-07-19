/* eslint-disable no-underscore-dangle */
import { Transaction } from '@databases/pg'
import Container, { Service } from 'typedi'
import { Logger } from '../../../../../../Commons/Logger'
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
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import ApiError from '../../../../Shared/Errors/ApiError'
import EntityCleaning from '../../../../Shared/Serializers/EntityCleaning'

export interface UserDependencies {
  country? : CountryDTO
  state? : StateDTO
  city? : CityDTO
  phoneNumber? : PhoneNumberDTO
}

@Service()
export class UserServices extends BaseCrudServices<User> {
/**
 *
 */
  constructor(
    private countryRepository : CountryRepository,
    private stateRepository : StateRepository,
    private cityRepository : CityRepository,
    private phoneNumberRepository : PhoneNumberRepository,
  ) {
    super(Container.get(UserRepository))
  }

  public async Create(userToCreate : User, userDependencies : UserDependencies) : Promise<User> {
    const {
      country, state, city, phoneNumber,
    } = userDependencies

    const phoneNumberId = await this.TryCreateUserDependencies({
      country, state, city, phoneNumber,
    })

    const insertedUser = await this.Repository.Create({ ...userToCreate, phoneNumberId })

    return insertedUser
  }

  public async Update(query : Partial<User>, userInfoToUpdate : Partial<User>, userDependencies? : UserDependencies) {
    const {
      country, state, city, phoneNumber,
    } = userDependencies

    const phoneNumberId = await this.TryCreateUserDependencies({
      country, state, city, phoneNumber,
    })

    const dependenciesReferences = EntityCleaning.CleanEntity({
      countryId: country?.id,
      stateId: state?.id,
      cityId: city?.id,
      phoneNumberId,
    })

    const userInfo = EntityCleaning.CleanSpecificFields(
      userInfoToUpdate,
      new Set([
        'countryId',
        'stateId',
        'cityId',
        'phoneNumberId',
        'planId',
      ]),
    )

    const isUpdated = await this.Repository.UpdateOne(query, { ...userInfo, ...dependenciesReferences })

    return isUpdated
  }

  private async TryCreateUserDependencies(userDependencies : UserDependencies) : Promise<number> {
    const self = this
    let phoneNumberId : number = null

    const {
      phoneNumber, city, country, state,
    } = userDependencies

    async function transaction() {
      await PgTypedDbConnection.db.tx(async (db) => {
        await self.TryCreateLocalities(db, country, state, city)

        if (phoneNumber) {
          const { id } = await self.phoneNumberRepository.Create(phoneNumber)
          phoneNumberId = id
        }
      })
    }

    try {
      await transaction()
      return phoneNumberId
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, ErrorMessages.InternalError, e)
    }
  }

  private async TryCreateLocalities(transaction : Transaction, country?: CountryDTO, state?: StateDTO, city?: CityDTO) {
    if (country) {
      const isCountryInserted = await this.countryRepository.FindOne({ id: country.id, iso2: country.iso2 }, transaction)
      if (!isCountryInserted) {
        Logger.info(`Creating country ${country.name}, with ID ${country.id}`)
        await this.countryRepository.Create(country, transaction)
      }
    }

    if (state) {
      const isStateInserted = await this.stateRepository.FindOne({ id: state.id, iso2: state.iso2 }, transaction)
      if (!isStateInserted) {
        Logger.info(`Creating state ${state.name}, with ID ${state.id}`)
        await this.stateRepository.Create(state, transaction)
      }
    }

    if (city) {
      const isCityInserted = await this.cityRepository.FindOne({ id: city.id }, transaction)
      if (!isCityInserted) {
        Logger.info(`Creating city ${city.name}, with ID ${city.id}`)
        await this.cityRepository.Create(city, transaction)
      }
    }
  }
}
