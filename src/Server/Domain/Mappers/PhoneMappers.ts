import {
  createMap, forMember, mapFrom, Mapper,
} from '@automapper/core'
import StaticImplements from '../../Commons/Anotations/StaticImplements'
import { IMapInstaller } from '../../Setup/Interfaces/IMapInstaller'
import { PhoneNumberDTO } from '../DTOs/PhoneNumberDTO'
import PhoneNumber from '../Entities/PhoneNumber'

@StaticImplements<IMapInstaller>()
export default class PhoneMapper {
  public static CreateMappings(mapper : Mapper) {
    createMap(
      mapper,
      PhoneNumber,
      PhoneNumberDTO,
      forMember(
        (dst) => dst.whatsappNumber,
        mapFrom((src) => src.whatsappNumber),
      ),
      forMember(
        (dst) => dst.whatsappId,
        mapFrom((src) => src.whatsappId),
      ),
    )
  }
}
