/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  afterMap, createMap, forMember, mapFrom, Mapper, mapWithArguments
} from '@automapper/core'
import StaticImplements from '../../../../../Commons/Anotations/StaticImplements'
import Bot, { PartialBot } from '../../../../../Domain/Entities/Bot'
import { IMapInstaller } from '../../../../../Setup/Interfaces/IMapInstaller'
import EntityCleaning from '../../../../Shared/Serializers/EntityCleaning'
import CreateBotRequest from './Requests/CreateBot/CreateBotRequest'
import GetAllBotsRequestQuery from './Requests/GetAllRequest/GetAllBotsRequestQuery'
import UpdateBotRequest from './Requests/UpdateBot/UpdateBotRequestBody'

@StaticImplements<IMapInstaller>()
export default class BotControllerMapper {
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
      forMember(
        (dst) => dst.userId,
        mapWithArguments((_s, { userId }) => userId),
      ),
    )

    createMap(
      mapper,
      GetAllBotsRequestQuery,
      Bot,
      forMember(
        (dst) => dst.botName,
        mapFrom((src) => src.botName),
      ),
      forMember(
        (dst) => dst.userId,
        mapWithArguments((_s, { userId }) => userId),
      ),
    )

    createMap(
      mapper,
      UpdateBotRequest,
      PartialBot,
      forMember(
        (dst) => dst.botName,
        mapFrom((src) => src.botName),
      ),
      forMember(
        (dst) => dst.steps,
        mapFrom((src) => src.steps),
      ),
      afterMap((_s, dst) => {
        EntityCleaning.RemoveNullableValues(dst)
      }),
    )
  }
}
