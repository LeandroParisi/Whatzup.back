import { AutoMap } from '@automapper/classes'
import {
  IsNotEmpty, IsNumber, IsString, Min,
} from 'class-validator'
import City from '../../../../Domain/Entities/City'

export class CityDTO implements City {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @AutoMap()
  id: number;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  name: string;
}
