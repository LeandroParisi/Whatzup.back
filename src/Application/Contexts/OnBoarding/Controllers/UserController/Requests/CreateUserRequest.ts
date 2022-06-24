import {
  IsEmail,
  IsNotEmpty, IsNumber, IsString,
} from 'class-validator'
import User from '../../../../../../Domain/Entities/User'

export default class CreateUserRequest implements Partial<User> {
  @IsNotEmpty()
  @IsString()
  whatsappNumber?: string

  @IsNotEmpty()
  @IsString()
  whatsappId?: string

  @IsNotEmpty()
  @IsEmail()
  email?: string

  @IsNotEmpty()
  @IsString()
  documentNumber?: string

  @IsNotEmpty()
  @IsString()
  firstName?: string

  @IsString()
  middleName?: string

  @IsNotEmpty()
  @IsString()
  lastName?: string

  @IsNotEmpty()
  @IsNumber()
  countryId?: number

  @IsNotEmpty()
  @IsNumber()
  stateId?: number

  @IsNotEmpty()
  @IsNumber()
  cityId?: number

  @IsNotEmpty()
  @IsNumber()
  neighbourhood?: string

  @IsNotEmpty()
  @IsString()
  addressStreet?: string

  @IsNotEmpty()
  @IsString()
  addressNumber?: string

  @IsNotEmpty()
  @IsString()
  addressComplement?: string

  @IsNotEmpty()
  @IsString()
  postalCode?: string
}
