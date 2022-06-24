import { StepInfo } from '../Step'
import IStepOption from './IStepOption'

export default class OptionsStepInfo extends StepInfo {
  readonly options : Array<IStepOption>
}
