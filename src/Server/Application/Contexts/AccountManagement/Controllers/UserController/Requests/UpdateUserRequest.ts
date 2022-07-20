import { AutoMap } from '@automapper/classes'
import { Type } from 'class-transformer'
import {
  IsEmail, IsNumber,
  IsString,
  Min, ValidateNested,
} from 'class-validator'
import { PhoneNumberDTO } from '../../../../../../Domain/DTOs/PhoneNumberDTO'
import User from '../../../../../../Domain/Entities/User'
import LocationRequest from '../../../../../Shared/APIs/Interfaces/Requests/LocationRequest'

export const UpdateUserPlanIdPath = 'body.planId' as string

export default class UpdateUserRequest extends LocationRequest implements Partial<User> {
  @ValidateNested()
  @Type(() => PhoneNumberDTO)
  @AutoMap(() => PhoneNumberDTO)
  phoneNumber? : PhoneNumberDTO

  @IsNumber()
  @Min(1)
  @AutoMap()
  planId?: number

  @IsEmail()
  @AutoMap()
  email?: string

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

  @IsNumber()
  @Min(1)
  stateId : number

  @IsNumber()
  @Min(1)
  cityId : number

  @IsNumber()
  @Min(1)
  countryId : number

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
