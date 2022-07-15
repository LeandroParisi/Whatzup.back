import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import StepTypes from '../../Entities/Steps/Enums/StepTypes'
import { StepInfo } from '../../Entities/Steps/Step'

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
