import {
  IsNotEmpty, IsNumber, IsString, Min,
} from 'class-validator'
import City from '../../../../Domain/Entities/City'

export class CityDTO implements City {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
