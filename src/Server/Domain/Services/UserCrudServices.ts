/* eslint-disable no-underscore-dangle */
import Container, { Service } from 'typedi'
import BaseCrudServices from '../../Application/Shared/APIs/BaseClasses/BaseCrudServices'
import EntityCleaning from '../../Application/Shared/Serializers/EntityCleaning'
import { PhoneNumberRepository } from '../../Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import { UserRepository } from '../../Infrastructure/PgTyped/Repositories/UserRepository'
import { PhoneNumberDTO } from '../DTOs/PhoneNumberDTO'
import User from '../Entities/User'

export interface UserDependencies {
  phoneNumber? : PhoneNumberDTO
}

@Service()
export class UserCrudServices extends BaseCrudServices<User> {
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
