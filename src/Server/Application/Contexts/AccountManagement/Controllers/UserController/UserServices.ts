/* eslint-disable no-underscore-dangle */
import Container, { Service } from 'typedi'
import { PhoneNumberDTO } from '../../../../../Domain/DTOs/PhoneNumberDTO'
import User from '../../../../../Domain/Entities/User'
import { PhoneNumberRepository } from '../../../../../Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import BaseCrudServices from '../../../../Shared/APIs/BaseClasses/BaseCrudServices'
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
}
