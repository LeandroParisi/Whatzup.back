import { AutoMap } from '@automapper/classes'
import {
  IsNotEmpty, IsString,
} from 'class-validator'
import PhoneNumber from '../../../Domain/Entities/PhoneNumber'

export class PhoneNumberDTO implements Partial<PhoneNumber> {
  @IsString()
  @AutoMap()
  whatsappId?: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  whatsappNumber: string;
}
