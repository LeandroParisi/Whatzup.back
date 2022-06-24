import User from '../../../../../../Domain/Entities/User'
import CreateUserRequest from '../../../Controllers/UserController/Requests/CreateUserRequest'

export class CreateUserDTO implements Partial<User> {
  whatsappNumber?: string

  whatsappId?: string

  email?: string

  documentNumber?: string

  firstName?: string

  middleName?: string

  lastName?: string

  stateId : number

  cityId : number

  countryId : number

  neighbourhood?: string

  addressStreet?: string

  addressNumber?: string

  addressComplement?: string

  postalCode?: string

  static MapFromCreateRequest(request : CreateUserRequest) : CreateUserDTO {
    const userDto = new CreateUserDTO()

    userDto.whatsappNumber = request.whatsappNumber
    userDto.whatsappId = request.whatsappId
    userDto.email = request.email
    userDto.documentNumber = request.documentNumber
    userDto.firstName = request.firstName
    userDto.middleName = request.middleName
    userDto.lastName = request.lastName
    userDto.stateId = request.state.id
    userDto.cityId = request.city.id
    userDto.countryId = request.country.id
    userDto.neighbourhood = request.neighbourhood
    userDto.addressStreet = request.addressStreet
    userDto.addressNumber = request.addressNumber
    userDto.addressComplement = request.addressComplement
    userDto.postalCode = request.postalCode

    return userDto
  }
}
