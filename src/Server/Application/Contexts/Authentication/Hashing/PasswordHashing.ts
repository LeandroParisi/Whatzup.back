import { compare, hash } from 'bcrypt'
import CONSTANTS from '../../../../Configuration/constants'

export default class PasswordHashing {
  static async HashPassword(password : string) {
    const hashedPassword = await hash(password, CONSTANTS.SALT_SECRET)
    return hashedPassword
  }

  static async VerifyPassword(password : string, hashedPassword : string) {
    const isPasswordCorrect = await compare(password, hashedPassword)
    return isPasswordCorrect
  }
}
