/* eslint-disable max-classes-per-file */
import { Type } from 'class-transformer'
import {
  IsArray, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateNested,
} from 'class-validator'
import Bot from '../../../../../../../Domain/Entities/Bot'
import StepTypes from '../../../../../../../Domain/Entities/Steps/Enums/StepTypes'
import { IStepOption } from '../../../../../../../Domain/Entities/Steps/OptionsStep/OptionsStepInfo'
import { Step } from '../../../../../../../Domain/Entities/Steps/Step'
import { BotDTO } from '../../../../UseCases/CreateBot/DTOs/BotDTO'
import { IsValidStep } from '../../../../../../Shared/CustomValidations/StepsValidation'
import { IsExistentUser } from '../../../../../../Shared/CustomValidations/IsExistentUser'

export class StepOptionRequest implements Partial<IStepOption> {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @Min(1)
  nextStep: number;

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

export class StepRequest implements Partial<Step> {
  // TODO: Ignorar esta propriedade, está aqui para permitir a herança
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
  @IsValidStep({ message: `Options are only valid for steps of type ${StepTypes.Options}` })
  @IsArray()
  @ValidateNested({ each: true })
  options: IStepOption[];
}

export default class CreateBotRequest implements Partial<Bot> {
  @IsNumber()
  @IsNotEmpty()
  @IsDefined()
  @IsExistentUser()
  readonly userId : number

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  readonly botName : string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepRequest)
  readonly steps : StepRequest[]

  public MapToDTO() : BotDTO {
    return new BotDTO(this.botName, this.steps)
  }
}
