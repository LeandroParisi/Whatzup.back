import { faker } from '@faker-js/faker'
import DateUtils from '../../../Server/Commons/Utils/DateUtils'
import { PhoneNumberDTO } from '../../../Server/Domain/DTOs/PhoneNumberDTO'
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

  public static GetXDTOs(quantity : number) : PhoneNumberDTO[] {
    const pns : PhoneNumberDTO[] = []

    for (let i = 1; i <= quantity; i += 1) {
      pns.push(this.GetDTO())
    }

    return pns
  }
}
