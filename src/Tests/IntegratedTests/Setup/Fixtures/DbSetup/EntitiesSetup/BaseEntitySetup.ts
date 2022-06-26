/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { TableHelper, WhereCondition } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections } from '../../../../../../Server/Application/Shared/Repositories/IRepository'
import { CaseSerializer } from '../../../../../../Server/Commons/Globals/Serializers/CaseSerializer'
import { TestDbConnection } from '../TestDbConnection'

@Service()
export abstract class BaseEntitySetup<
    Entity,
    DbEntity,
    DbInsertableEntity
  > {
  abstract table : TableHelper<DbEntity, DbInsertableEntity, 'defaultConnection'>

  async Create(model: Partial<Entity>, connection?: Connections): Promise<Entity> {
    const dbConnection = connection || TestDbConnection.db

    const serializedEntity = CaseSerializer.CastToSnake<Partial<Entity>, DbInsertableEntity>(model)

    const [inserted] = await this.table(dbConnection).insert(serializedEntity)

    const deserializedEntity = CaseSerializer.CastToCamel<DbEntity, Entity>(inserted)

    console.log({ deserializedEntity })

    return deserializedEntity
  }

  async FindOne(query: Partial<Entity>, connection?: Connections): Promise<Entity> {
    const dbConnection = connection || TestDbConnection.db

    const serializedQuery = CaseSerializer.CastToSnake<Partial<Entity>, WhereCondition<DbEntity>>(query)

    const entity = await this.table(dbConnection).findOne(serializedQuery)

    console.log({ entity })

    return CaseSerializer.CastToCamel<DbEntity, Entity>(entity)
  }

  // async UpdateOne(
  //   query: WhereCondition<DbEntity>, model: Partial<DbEntity>, connection?: Connections,
  // ): Promise<boolean> {
  //   const dbConnection = connection || TestDbConnection.db

  //   const [updatedEntities] = await this.table(dbConnection).update(
  //     query,
  //     model,
  //   )

  //   return !!updatedEntities
  // }

  // async Delete(query: WhereCondition<DbEntity>, connection?: Connections): Promise<void> {
  //   const dbConnection = connection || TestDbConnection.db

  //   const del = await this.table(dbConnection).delete(query)
  // }

  // async FindAll(query: WhereCondition<DbEntity>, connection?: Connections): Promise<DbEntity[]> {
  //   const dbConnection = connection || TestDbConnection.db

  //   const entities = await this.table(dbConnection).find(query).all()

  //   return entities
  // }
}
