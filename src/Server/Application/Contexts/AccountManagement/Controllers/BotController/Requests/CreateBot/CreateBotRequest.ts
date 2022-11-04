/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer'
import {
  IsArray, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf, ValidateNested,
} from 'class-validator'
import { PhoneNumberDTO } from '../../../../../../../Domain/DTOs/PhoneNumberDTO'
import Bot from '../../../../../../../Domain/Entities/Bot'
import StepTypes from '../../../../../../../Domain/Entities/Steps/Enums/StepTypes'
import { IStepOption } from '../../../../../../../Domain/Entities/Steps/OptionsStep/OptionsStepInfo'
import { Step } from '../../../../../../../Domain/Entities/Steps/Step'
import { IsValidOptionsType, IsValidStepType } from '../../../../../../Shared/CustomValidations/Bot/ClassValidators/StepsValidation'

export const CreateBotStepPath = 'body.steps' as string

export class StepOptionRequest implements IStepOption {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @Min(1)
  nextStepId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  selectionKey: number;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsDefined()
  @IsString({ each: true })
  outboundMessages: string[];
}

export class StepRequest implements Step {
  @IsNumber()
  @IsDefined()
  @Min(1)
  id : number

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  name: string;

  @IsEnum(StepTypes)
  @IsNotEmpty()
  @IsDefined()
  type: StepTypes;

  @IsString({ each: true })
  @IsNotEmpty()
  @IsDefined()
  introMessage: string[];

  @Type(() => StepOptionRequest)
  @IsValidStepType()
  @IsValidOptionsType()
  @IsArray()
  @ValidateNested({ each: true })
  options?: StepOptionRequest[];
}

export default class CreateBotRequest implements Partial<Bot> {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  botName : string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepRequest)
  steps : StepRequest[]

  @ValidateIf((o : CreateBotRequest) => !!o?.phoneNumbers?.length)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberDTO)
  phoneNumbers : PhoneNumberDTO[]
}
