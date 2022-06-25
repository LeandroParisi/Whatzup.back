import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import StepTypes from '../../../../Domain/Entities/Steps/Enums/StepTypes'
import { Step, StepInfo } from '../../../../Domain/Entities/Steps/Step'

export default class StepsDTO implements Partial<StepInfo> {
  @IsString()
  @IsNotEmpty()
  readonly name : string

  @IsNotEmpty()
  @IsEnum(StepTypes)
  readonly type : StepTypes

  @IsString()
  readonly introMessage? : string[]
}
