import Container from 'typedi'
import User from '../../../../../Domain/Entities/User'
import { UserRepository } from '../../../../../Infrastructure/PgTyped/Repositories/UserRepository'
import { StatusCode } from '../../../APIs/Enums/Status'
import ApiError from '../../../Errors/ApiError'
import { InexistentUserError } from '../../../Errors/SpecificErrors/InexistentUserError'

export default async function CheckIsValidUser(id: number) : Promise<User> {
  const userRepository = Container.get(UserRepository)
  const user = await userRepository.FindOne({ id })

  if (!user) throw new InexistentUserError()

  // Todo: Transformar essa validação em um validator específico
  if (!user.planId) throw new ApiError(StatusCode.FORBIDDEN, 'You need to have a plan before creating a bot.')

  return user
}
