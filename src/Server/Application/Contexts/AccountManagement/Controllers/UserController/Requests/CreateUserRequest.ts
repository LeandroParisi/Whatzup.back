import { AutoMap } from '@automapper/classes'
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
  @AutoMap()
  whatsappNumber?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  whatsappId?: string

  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  password?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  documentNumber?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  firstName?: string

  @IsString()
  @AutoMap()
  middleName?: string

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  neighbourhood?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  addressStreet?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  addressNumber?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  addressComplement?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  postalCode?: string
}
