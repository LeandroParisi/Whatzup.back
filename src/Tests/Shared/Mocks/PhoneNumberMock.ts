import { faker } from '@faker-js/faker'
import { PhoneNumberDTO } from '../../../Server/Application/Shared/DTOs/PhoneNumberDTO'
import DateUtils from '../../../Server/Commons/Utils/DateUtils'
import PhoneNumber from '../../../Server/Domain/Entities/PhoneNumber'

type MockOptionals = Partial<PhoneNumber>

export default class PhoneNumberMock {
  public static GetRandom(optionals? : MockOptionals) : PhoneNumber {
    const number = faker.phone.number()

    const phoneNumber : PhoneNumber = {
      id: optionals?.id || null,
      whatsappId: optionals?.whatsappId || `${number}.ca.us`,
      whatsappNumber: optionals?.whatsappId || number,
      isActive: optionals?.isActive || faker.datatype.boolean(),
      createdAt: optionals?.createdAt || DateUtils.DateNow(),
      updatedAt: optionals?.updatedAt || DateUtils.DateNow(),
    }

    return phoneNumber
  }

  public static GetDTO(optionals? : Partial<PhoneNumberDTO>) : PhoneNumberDTO {
    const number = faker.phone.number()

    return {
      whatsappId: optionals?.whatsappId || `${number}.ca.us`,
      whatsappNumber: optionals?.whatsappId || number,
    }
  }
}
