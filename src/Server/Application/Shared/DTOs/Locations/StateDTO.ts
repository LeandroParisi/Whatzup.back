import { AutoMap } from '@automapper/classes'
import {
  IsNotEmpty, IsNumber, IsString, MaxLength, Min,
} from 'class-validator'
import State from '../../../../Domain/Entities/State'

export class StateDTO implements State {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @AutoMap()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @AutoMap()
  countryId: number;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  stateCode: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @AutoMap()
  iso2: string;
}
