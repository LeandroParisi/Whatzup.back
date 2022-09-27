import PasswordHashing from '../../Application/Contexts/Authentication/Hashing/PasswordHashing'
import { ErrorMessages } from '../../Application/Shared/APIs/Enums/Messages'
import { StatusCode } from '../../Application/Shared/APIs/Enums/Status'
import { UserRepository } from '../../Infrastructure/PgTyped/Repositories/UserRepository'
import ILoginPayload from '../DTOs/ILoginPayload'
import User from '../Entities/User'
import ApiError from '../Errors/ApiError'

export default class AuthenticationServices {
  constructor(
    private userRepository : UserRepository,
  ) { }

  public async CheckUserEmailAndPassword(loginPayload : ILoginPayload) : Promise<User> {
    const { email, password } = loginPayload

    const user = await this.GetUser(email)

    try {
      await PasswordHashing.VerifyPassword(password, user.password)
    } catch (error) {
      throw new ApiError(StatusCode.UNAUTHORIZED, ErrorMessages.Unauthorized)
    }

    return user
  }

  private async GetUser(email: string) : Promise<User> {
    const user = await this.userRepository.FindOne({ email })

    if (!user) throw new ApiError(StatusCode.NOT_FOUND, ErrorMessages.NotFound)

    return user
  }
}
