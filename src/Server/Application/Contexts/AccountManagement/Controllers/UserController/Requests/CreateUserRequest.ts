/* eslint-disable no-use-before-define */
import { AutoMap } from '@automapper/classes'
import { Type } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty, IsNumber,
  IsString,
  Min,
  ValidateIf,
  ValidateNested
} from 'class-validator'
import { PhoneNumberDTO } from '../../../../../../Domain/DTOs/PhoneNumberDTO'
import User from '../../../../../../Domain/Entities/User'
import LocationRequest from '../../../../../Shared/APIs/Interfaces/Requests/LocationRequest'
import { IsValidFullLocation } from '../../../../../Shared/CustomValidations/Locations/ClassValidators/IsValidFullLocation'
import HasPlanId from '../../../../../Shared/CustomValidations/Plans/FunctionValidators/HasPlanId'

export default class CreateUserRequest extends LocationRequest implements Partial<User> {
  @IsValidFullLocation()

  @ValidateNested()
  @Type(() => PhoneNumberDTO)
  @AutoMap(() => PhoneNumberDTO)
  phoneNumber : PhoneNumberDTO

  @ValidateIf((o : CreateUserRequest) => HasPlanId(o.planId))
  @IsNumber()
  @Min(1)
  @AutoMap()
  planId?: number

  @IsNotEmpty()
  @IsEmail()
  @AutoMap()
  email: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  password: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  documentNumber: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  firstName: string

  @IsString()
  @AutoMap()
  middleName?: string

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  lastName: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  stateId : number

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  cityId : number

  @IsNotEmpty()
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
