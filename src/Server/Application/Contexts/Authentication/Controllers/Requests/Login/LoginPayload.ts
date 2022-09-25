import { IsDefined, IsEmail, IsString } from 'class-validator'

export default class LoginPayload {
  @IsDefined()
  @IsEmail()
  email : string

  @IsDefined()
  @IsString()
  password : string
}
