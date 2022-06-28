import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import Container, { Service } from 'typedi'
import { UserRepository } from '../../../Infrastructure/PgTyped/Repositories/UserRepository'

@ValidatorConstraint({ async: true })
@Service()
export class IsExistentUserConstraint implements ValidatorConstraintInterface {
  validate(userId: number) {
    const userRepository = Container.get(UserRepository)

    return userRepository.FindOne({ id: userId }).then((user) => {
      if (user) return true
      return false
    })
  }
}

export function IsExistentUser(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...validationOptions, message: "Invalid user, there's no user with this id" },
      constraints: [],
      validator: IsExistentUserConstraint,
    })
  }
}
