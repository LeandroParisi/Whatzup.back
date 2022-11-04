import { IsDefined, IsEmail, IsString } from 'class-validator'
import ILoginPayload from '../../../../../../Domain/DTOs/ILoginPayload'

export default class LoginPayload implements ILoginPayload {
  @IsDefined()
  @IsEmail()
  email : string

  @IsDefined()
  @IsString()
  password : string
}
