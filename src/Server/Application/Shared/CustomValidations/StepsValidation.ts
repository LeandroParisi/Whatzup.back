/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'
import StepTypes from '../../../Domain/Entities/Steps/Enums/StepTypes'
import { StepRequest } from '../../Contexts/AccountManagement/Controllers/BotController/Requests/CreateBot/CreateBotRequest'

export function IsValidStep(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isValidStep',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
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
