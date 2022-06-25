import {
  IsNotEmpty, IsNumber, IsString, MaxLength, Min,
} from 'class-validator'
import Country from '../../../../Domain/Entities/Country'

export class CountryDTO implements Country {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  iso2: string;
}
