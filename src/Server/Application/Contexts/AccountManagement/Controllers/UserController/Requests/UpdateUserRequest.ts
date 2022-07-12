import { AutoMap } from '@automapper/classes'
import { Type } from 'class-transformer'
import {
  IsEmail, IsNumber,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import User from '../../../../../../Domain/Entities/User'
import { CityDTO } from '../../../../../Shared/DTOs/Locations/CityDTO'
import { CountryDTO } from '../../../../../Shared/DTOs/Locations/CountryDTO'
import { StateDTO } from '../../../../../Shared/DTOs/Locations/StateDTO'

export const UpdateUserPlanIdPath = 'body.planId' as string

export default class UpdateUserRequest implements Partial<User> {
  @IsString()
  @AutoMap()
  whatsappNumber?: string

  @ValidateIf((o : UpdateUserRequest) => o?.planId !== undefined)
  @IsNumber()
  @Min(1)
  @AutoMap()
  planId?: number

  @IsString()
  @AutoMap()
  whatsappId?: string

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
