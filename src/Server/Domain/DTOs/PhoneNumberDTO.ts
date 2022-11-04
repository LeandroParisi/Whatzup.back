import { AutoMap } from '@automapper/classes'
import {
  IsDefined,
  IsNotEmpty, IsString,
} from 'class-validator'
import PhoneNumber from '../Entities/PhoneNumber'

export class PhoneNumberDTO implements Partial<PhoneNumber> {
  @IsString()
  @AutoMap()
  whatsappId?: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @AutoMap()
  whatsappNumber: string;
}
