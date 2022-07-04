/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer'
import {
  IsArray, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateNested,
} from 'class-validator'
import Bot from '../../../../../../../Domain/Entities/Bot'
import StepTypes from '../../../../../../../Domain/Entities/Steps/Enums/StepTypes'
import { IStepOption } from '../../../../../../../Domain/Entities/Steps/OptionsStep/OptionsStepInfo'
import { Step } from '../../../../../../../Domain/Entities/Steps/Step'
import { IsValidOptionsType, IsValidStepType } from '../../../../../../Shared/CustomValidations/Bot/StepsValidation'

export class StepOptionRequest implements IStepOption {
  @IsNumber()
  @Min(1)
  @IsDefined()
  nextStepId: number;

  @IsNumber()
  @IsDefined()
  selectionKey: number;

  @IsString()
  @IsDefined()
  name: string;

  @IsString({ each: true })
  @IsDefined()
  outboundMessages: string[];
}

export class StepRequest implements Step {
  @IsNumber()
  @IsDefined()
  @Min(1)
  id : number

  @IsString()
  @IsDefined()
  name: string;

  @IsEnum(StepTypes)
  @IsDefined()
  type: StepTypes;

  @IsString({ each: true })
  @IsDefined()
  introMessage: string[];

  @Type(() => StepOptionRequest)
  @IsValidStepType()
  @IsValidOptionsType()
  @IsArray()
  @ValidateNested({ each: true })
  options?: StepOptionRequest[];
}

export default class UpdateBotRequest implements Partial<Bot> {
  @IsNotEmpty()
  @IsString()
  botName : string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepRequest)
  steps : StepRequest[]
}
