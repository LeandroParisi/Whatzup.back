import { AutoMap } from '@automapper/classes'
import { Type } from 'class-transformer'
import {
  IsEmail, IsNumber,
  IsString,
  Min, ValidateNested
} from 'class-validator'
import { CityDTO } from '../../../../../../Domain/DTOs/Locations/CityDTO'
import { CountryDTO } from '../../../../../../Domain/DTOs/Locations/CountryDTO'
import { StateDTO } from '../../../../../../Domain/DTOs/Locations/StateDTO'
import { PhoneNumberDTO } from '../../../../../../Domain/DTOs/PhoneNumberDTO'
import User from '../../../../../../Domain/Entities/User'

export const UpdateUserPlanIdPath = 'body.planId' as string

export default class UpdateUserRequest implements Partial<User> {
  @ValidateNested()
  @Type(() => PhoneNumberDTO)
  @AutoMap(() => PhoneNumberDTO)
  phoneNumber : PhoneNumberDTO

  @IsNumber()
  @Min(1)
  @AutoMap()
  planId?: number

  @IsEmail()
  @AutoMap()
  email?: string

  @IsString()
  @AutoMap()
  password?: string

  @IsString()
  @AutoMap()
  documentNumber?: string

  @IsString()
  @AutoMap()
  firstName?: string

  @IsString()
  @AutoMap()
  middleName?: string

  @IsString()
  @AutoMap()
  lastName?: string

  @ValidateNested()
  @Type(() => StateDTO)
  @AutoMap(() => StateDTO)
  state : StateDTO

  @ValidateNested()
  @Type(() => CityDTO)
  @AutoMap(() => CityDTO)
  city : CityDTO

  @ValidateNested()
  @Type(() => CountryDTO)
  @AutoMap(() => CountryDTO)
  country : CountryDTO

  @IsString()
  @AutoMap()
  neighbourhood?: string

  @IsString()
  @AutoMap()
  addressStreet?: string

  @IsString()
  @AutoMap()
  addressNumber?: string

  @IsString()
  @AutoMap()
  addressComplement?: string

  @IsString()
  @AutoMap()
  postalCode?: string
}
