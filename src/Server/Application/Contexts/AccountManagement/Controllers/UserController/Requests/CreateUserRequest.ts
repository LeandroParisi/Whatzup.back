import { Type } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator'
import User from '../../../../../../Domain/Entities/User'
import { CityDTO } from '../../../../../Shared/DTOs/Locations/CityDTO'
import { CountryDTO } from '../../../../../Shared/DTOs/Locations/CountryDTO'
import { StateDTO } from '../../../../../Shared/DTOs/Locations/StateDTO'

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

  @ValidateNested()
  @Type(() => StateDTO)
  state : StateDTO

  @ValidateNested()
  @Type(() => CityDTO)
  city : CityDTO

  @ValidateNested()
  @Type(() => CountryDTO)
  country : CountryDTO

  @IsNotEmpty()
  @IsString()
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
