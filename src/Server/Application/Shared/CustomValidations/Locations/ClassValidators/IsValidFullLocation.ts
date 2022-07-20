/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import Container, { Service } from 'typedi'
import { CityRepository } from '../../../../../Infrastructure/PgTyped/Repositories/CityRepository'
import { CountryRepository } from '../../../../../Infrastructure/PgTyped/Repositories/CountryRepository'
import { StateRepository } from '../../../../../Infrastructure/PgTyped/Repositories/StateRepository'
import LocationRequest from '../../../APIs/Interfaces/Requests/LocationRequest'

@ValidatorConstraint({ async: true })
@Service()
export class IsValidFullLocationConstraint implements ValidatorConstraintInterface {
  async validate(_value: any, args: ValidationArguments) {
    const { cityId, countryId, stateId } = (args.object as LocationRequest)

    const countryRepository = Container.get(CountryRepository)
    const stateRepository = Container.get(StateRepository)
    const cityRepository = Container.get(CityRepository)

    const cityOnDb = await cityRepository.FindOne({ id: cityId })
    const stateOnDb = await stateRepository.FindOne({ id: stateId })
    const countryOnDb = await countryRepository.FindOne({ id: countryId })

    const locationsExist = !!countryOnDb && !!stateOnDb && !!cityOnDb

    if (!locationsExist) return false

    const isCorrectRelation = stateOnDb.countryId === countryId && cityOnDb.stateId === stateId

    return  isCorrectRelation
  }
}

export function IsValidFullLocation(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { ...validationOptions, message: 'Invalid location informations.' },
      constraints: [],
      validator: IsValidFullLocationConstraint,
    })
  }
}
