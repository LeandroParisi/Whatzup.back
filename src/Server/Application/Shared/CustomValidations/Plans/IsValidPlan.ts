// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator'
// import { Service } from 'typedi'

// export interface IPlanValidationParam {
//   userId : number
//   newBot? : boolean
// }

// @ValidatorConstraint({ async: true })
// @Service()
// export class IsValidPlanValidator implements ValidatorConstraintInterface {
//   validate(params: IPlanValidationParam) {
//     const { userId, newBot } = params
//   }
// }

// export function IsValidPlan(validationOptions?: ValidationOptions) {
//   return (object: Object, propertyName: string) => {
//     const message = validationOptions?.message || 'TODO'

//     registerDecorator({
//       target: object.constructor,
//       propertyName,
//       options: { ...validationOptions, message },
//       constraints: [],
//       validator: IsValidPlanValidator,
//     })
//   }
// }
