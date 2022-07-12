/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'
import StepTypes from '../../../../../Domain/Entities/Steps/Enums/StepTypes'
import { StepRequest } from '../../../../Contexts/AccountManagement/Controllers/BotController/Requests/CreateBot/CreateBotRequest'

export function IsValidStepType(validationOptions?: ValidationOptions) {
  const defaultMessage = `Options are only valid for steps of type ${StepTypes.Options}`

  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidStepType',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { message: defaultMessage, ...validationOptions },
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const { type } = (args.object as StepRequest)

          if (type !== StepTypes.Options) {
            return false
          }

          return true
        },
      },
    })
  }
}

export function IsValidOptionsType(validationOptions?: ValidationOptions) {
  const defaultMessage = `A step of type ${StepTypes.Options} must have at least one option related to it`

  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidOptionsType',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: { message: defaultMessage, ...validationOptions },
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const { type, options } = (args.object as StepRequest)

          if (type === StepTypes.Options) {
            return !!options?.length
          }

          return true
        },
      },
    })
  }
}
