import {
  createMap, forMember, mapFrom, Mapper,
} from '@automapper/core'
import StaticImplements from '../../../../../Commons/Anotations/StaticImplements'
import Bot from '../../../../../Domain/Entities/Bot'
import { IMapInstaller } from '../../../../../Setup/Interfaces/IMapInstaller'
import CreateBotRequest from './Requests/CreateBot/CreateBotRequest'

@StaticImplements<IMapInstaller>()
export default class CreateBotMapper {
  public static CreateMappings(mapper : Mapper) {
    createMap(
      mapper,
      CreateBotRequest,
      Bot,
      forMember(
        (dst) => dst.botName,
        mapFrom((src) => src.botName),
      ),
      forMember(
        (dst) => dst.steps,
        mapFrom((src) => src.steps),
      ),
    )
  }
}
