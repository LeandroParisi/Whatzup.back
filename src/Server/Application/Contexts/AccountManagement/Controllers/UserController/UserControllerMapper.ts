import {
  afterMap, createMap, forMember, ignore, mapFrom, Mapper, mapWithArguments
} from '@automapper/core'
import StaticImplements from '../../../../../../Commons/Anotations/StaticImplements'
import User, { PartialUser } from '../../../../../Domain/Entities/User'
import { IMapInstaller } from '../../../../../Setup/Interfaces/IMapInstaller'
import CreateUserRequest from './Requests/CreateUserRequest'
import UpdateUserRequest from './Requests/UpdateUserRequest'

@StaticImplements<IMapInstaller>()
export default class UserControllerMapper {
  public static CreateMappings(mapper : Mapper) {
    createMap(
      mapper,
      CreateUserRequest,
      User,
      forMember(
        (dst) => dst.cityId,
        mapFrom((src) => src.cityId),
      ),
      forMember(
        (dst) => dst.stateId,
        mapFrom((src) => src.stateId),
      ),
      forMember(
        (dst) => dst.countryId,
        mapFrom((src) => src.countryId),
      ),
      forMember(
        (dst) => dst.id,
        ignore(),
      ),
      forMember(
        (dst) => dst.isActive,
        ignore(),
      ),
      forMember(
        (dst) => dst.isVerified,
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

    createMap(
      mapper,
      UpdateUserRequest,
      PartialUser,
      forMember(
        (dst) => dst.cityId,
        mapFrom((src) => src.cityId),
      ),
      forMember(
        (dst) => dst.stateId,
        mapFrom((src) => src.stateId),
      ),
      forMember(
        (dst) => dst.countryId,
        mapFrom((src) => src.countryId),
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
