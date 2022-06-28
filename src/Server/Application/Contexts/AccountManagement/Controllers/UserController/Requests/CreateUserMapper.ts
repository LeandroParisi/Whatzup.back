import {
  createMap, forMember, ignore, mapFrom, Mapper,
} from '@automapper/core'
import StaticImplements from '../../../../../../Commons/Anotations/StaticImplements'
import User from '../../../../../../Domain/Entities/User'
import { IMapInstaller } from '../../../../../../Setup/Interfaces/IMapInstaller'
import CreateUserRequest from './CreateUserRequest'

@StaticImplements<IMapInstaller>()
export default class CreateUserMapper {
  public static CreateMappings(mapper : Mapper) {
    createMap(
      mapper,
      CreateUserRequest,
      User,
      forMember(
        (dst) => dst.cityId,
        mapFrom((src) => src.city.id),
      ),
      forMember(
        (dst) => dst.stateId,
        mapFrom((src) => src.state.id),
      ),
      forMember(
        (dst) => dst.countryId,
        mapFrom((src) => src.country.id),
      ),
      forMember(
        (dst) => dst.id,
        ignore(),
      ),
    )
  }
}
