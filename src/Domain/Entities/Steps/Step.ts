import StepTypes from './Enums/StepTypes'
import OptionsStepInfo from './OptionsStep/OptionsStepInfo'

export class StepInfo {
  readonly id : number

  readonly name : string

  readonly type : StepTypes

  readonly introMessage : string[]

  public GetType() : StepTypes {
    return this.type
  }
}

export type Step = StepInfo | OptionsStepInfo
