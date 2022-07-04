/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { TableHelper, WhereCondition } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections, IBaseRepository } from '../../../Application/Shared/Repositories/IRepository'
import { CaseSerializer } from '../../../Commons/Globals/Serializers/CaseSerializer'
import { Logger } from '../../../Commons/Logger'
import DateUtils from '../../../Commons/Utils/DateUtils'
import { BaseEntity } from '../../../Domain/Entities/BaseClasses/BaseEntity'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'

@Service()
export abstract class BaseRepository<
    Entity extends BaseEntity,
    DbEntity,
    DbInsertableEntity
  > implements IBaseRepository<Entity> {
  abstract table : TableHelper<DbEntity, DbInsertableEntity, 'defaultConnection'>

  async Create(model: Partial<Entity>, connection?: Connections): Promise<Entity> {
    const dbConnection = connection || PgTypedDbConnection.db

    const cleanedEntity = this.CleanEntity(model)

    const serializedEntity = CaseSerializer.CastToSnake<Partial<Entity>, DbInsertableEntity>(cleanedEntity)

    Logger.info(`Executing query: Create with the following parameters\n${serializedEntity}`)

    const [inserted] = await this.table(dbConnection).insert(serializedEntity)

    const deserializedEntity = CaseSerializer.CastToCamel<DbEntity, Entity>(inserted)

    return deserializedEntity
  }

  async FindOne(query: Partial<Entity>, connection?: Connections): Promise<Entity> {
    const dbConnection = connection || PgTypedDbConnection.db

    const serializedQuery = CaseSerializer.CastToSnake<Partial<Entity>, WhereCondition<DbEntity>>(query)

    Logger.info(`Executing query: FindOne with the following parameters\n${serializedQuery}`)

    const entity = await this.table(dbConnection).findOne(serializedQuery)

    return CaseSerializer.CastToCamel<DbEntity, Entity>(entity)
  }

  async Count(query: Partial<Entity>, connection?: Connections) : Promise<number> {
    const dbConnection = connection || PgTypedDbConnection.db

    const serializedQuery = CaseSerializer.CastToSnake<Partial<Entity>, WhereCondition<DbEntity>>(query)

    Logger.info(`Executing query: FindOne with the following parameters\n${serializedQuery}`)

    const count = await this.table(dbConnection).count(serializedQuery)

    return count
  }

  async UpdateOne(
    updateQuery: Partial<Entity>, entity: Partial<Entity>, connection?: Connections,
  ): Promise<boolean> {
    const dbConnection = connection || PgTypedDbConnection.db

    const serializedQuery = CaseSerializer.CastToSnake<Partial<Entity>, WhereCondition<DbEntity>>(updateQuery)

    const serializedEntity = CaseSerializer.CastToSnake<Partial<Entity>, Partial<DbEntity>>(entity)

    const [updatedEntities] = await this.table(dbConnection).update(
      serializedQuery,
      { ...serializedEntity, updated_at: DateUtils.DateNow() },
    )

    return !!updatedEntities
  }

  private CleanEntity(model: Partial<Entity>) : Partial<Entity> {
    const entity = { ...model }

    Object.entries(entity).forEach(([key, value]) => {
      if (!value && value !== 0) {
        delete entity[key]
      }
    })

    return entity
  }

  // async Delete(query: WhereCondition<DbEntity>, connection?: Connections): Promise<void> {
  //   const dbConnection = connection || PgTypedDbConnection.db

  //   const del = await this.table(dbConnection).delete(query)
  // }

  // async FindAll(query: WhereCondition<DbEntity>, connection?: Connections): Promise<DbEntity[]> {
  //   const dbConnection = connection || PgTypedDbConnection.db

  //   const entities = await this.table(dbConnection).find(query).all()

  //   return entities
  // }
}
