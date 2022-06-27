import {
  IsNotEmpty, IsNumber, IsString, MaxLength, Min,
} from 'class-validator'
import State from '../../../../Domain/Entities/State'

export class StateDTO implements State {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  id: number;

  @IsNumber()
  @IsNotEmpty()
  countryId: number;

  @IsString()
  @IsNotEmpty()
  stateCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  iso2: string;
}
