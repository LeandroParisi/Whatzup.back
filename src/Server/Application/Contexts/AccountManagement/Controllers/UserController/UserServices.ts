/* eslint-disable no-underscore-dangle */
import Container, { Service } from 'typedi'
import { PhoneNumberDTO } from '../../../../../Domain/DTOs/PhoneNumberDTO'
import User from '../../../../../Domain/Entities/User'
import { PgTypedDbConnection } from '../../../../../Infrastructure/PgTyped/PostgresTypedDbConnection'
import { PhoneNumberRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import BaseCrudServices from '../../../../Shared/APIs/BaseClasses/BaseCrudServices'
import { ErrorMessages } from '../../../../Shared/APIs/Enums/Messages'
import { StatusCode } from '../../../../Shared/APIs/Enums/Status'
import ApiError from '../../../../Shared/Errors/ApiError'
import EntityCleaning from '../../../../Shared/Serializers/EntityCleaning'

export interface UserDependencies {
  phoneNumber? : PhoneNumberDTO
}

@Service()
export class UserServices extends BaseCrudServices<User> {
/**
 *
 */
  constructor(
    private phoneNumberRepository : PhoneNumberRepository,
  ) {
    super(Container.get(UserRepository))
  }

  public async Create(userToCreate : User, userDependencies : UserDependencies) : Promise<User> {
    const {
      phoneNumber,
    } = userDependencies

    const { id: phoneNumberId } = await this.phoneNumberRepository.Create(phoneNumber)

    const insertedUser = await this.Repository.Create({ ...userToCreate, phoneNumberId })

    return insertedUser
  }

  public async Update(query : Partial<User>, userInfo : Partial<User>, userDependencies? : UserDependencies) {
    const {
      phoneNumber,
    } = userDependencies

    let userInfoToUpdate = { ...userInfo }

    if (phoneNumber) {
      const { id } = await this.phoneNumberRepository.Create(phoneNumber)
      userInfoToUpdate.phoneNumberId = id
    }

    userInfoToUpdate = EntityCleaning.CleanSpecificFields(
      userInfoToUpdate,
      new Set([
        'phoneNumberId',
        'planId',
      ]),
    )

    const isUpdated = await this.Repository.UpdateOne(query, { ...userInfoToUpdate })

    return isUpdated
  }

  private async TryCreateUserDependencies(userDependencies : UserDependencies) : Promise<number> {
    const self = this
    let phoneNumberId : number = null

    const {
      phoneNumber,
    } = userDependencies

    async function transaction() {
      await PgTypedDbConnection.db.tx(async (db) => {
        if (phoneNumber) {
          const { id } = await self.phoneNumberRepository.Create(phoneNumber, db)
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

  // private async TryCreateLocalities(transaction : Transaction, country?: CountryDTO, state?: StateDTO, city?: CityDTO) {
  //   if (country) {
  //     const isCountryInserted = await this.countryRepository.FindOne({ id: country.id, iso2: country.iso2 }, transaction)
  //     if (!isCountryInserted) {
  //       Logger.info(`Creating country ${country.name}, with ID ${country.id}`)
  //       await this.countryRepository.Create(country, transaction)
  //     }
  //   }

  //   if (state) {
  //     const isStateInserted = await this.stateRepository.FindOne({ id: state.id, iso2: state.iso2 }, transaction)
  //     if (!isStateInserted) {
  //       Logger.info(`Creating state ${state.name}, with ID ${state.id}`)
  //       await this.stateRepository.Create(state, transaction)
  //     }
  //   }

  //   if (city) {
  //     const isCityInserted = await this.cityRepository.FindOne({ id: city.id }, transaction)
  //     if (!isCityInserted) {
  //       Logger.info(`Creating city ${city.name}, with ID ${city.id}`)
  //       await this.cityRepository.Create(city, transaction)
  //     }
  //   }
  // }
}
