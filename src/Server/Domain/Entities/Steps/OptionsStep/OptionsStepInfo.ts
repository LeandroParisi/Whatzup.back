import { StepInfo } from '../Step'

export interface IStepOption {
  readonly nextStepId : number
  readonly selectionKey : number
  readonly name : string
  readonly outboundMessages : string[]
  // actions:
}

export class OptionsStepInfo extends StepInfo {
  readonly options? : Array<IStepOption>
}
