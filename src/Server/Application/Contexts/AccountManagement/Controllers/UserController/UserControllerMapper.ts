import {
  afterMap, createMap, forMember, ignore, mapFrom, Mapper, mapWithArguments,
} from '@automapper/core'
import StaticImplements from '../../../../../Commons/Anotations/StaticImplements'
import User from '../../../../../Domain/Entities/User'
import { IMapInstaller } from '../../../../../Setup/Interfaces/IMapInstaller'
import CreateUserRequest from './Requests/CreateUserRequest'

@StaticImplements<IMapInstaller>()
export default class UserControllerMapper {
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
      forMember(
        (dst) => dst.password,
        mapWithArguments((_s, { hashedPassword }) => hashedPassword),
      ),
      afterMap(
        (src, dst) => {
          if (src.planId === 0) {
            Object.assign(dst, { planId: null })
          }
        },
      ),
    )
  }
}
