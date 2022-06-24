/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ConnectionPool, Transaction } from '@databases/pg'
import { TableHelper, WhereCondition } from '@databases/pg-typed'
import { Service } from 'typedi'
import { IBaseRepository } from '../../../Application/Shared/Repositories/IRepository'
import { CaseSerializer } from '../../../Commons/Globals/Serializers/CaseSerializer'
import { Logger } from '../../../Commons/Logger'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'

@Service()
export abstract class BaseRepository<
    Entity,
    DbEntity,
    DbInsertableEntity
  > implements IBaseRepository<Entity> {
  abstract table : TableHelper<DbEntity, DbInsertableEntity, 'defaultConnection'>

  async Create(model: Partial<Entity>, connection?: ConnectionPool | Transaction): Promise<Entity> {
    const dbConnection = connection || PgTypedDbConnection.db

    const serializedEntity = CaseSerializer.CastToSnake<Partial<Entity>, DbInsertableEntity>(model)

    Logger.info(`Executing query: Create with the following parameters\n${serializedEntity}`)

    const [inserted] = await this.table(dbConnection).insert(serializedEntity)

    const deserializedEntity = CaseSerializer.CastToCamel<DbEntity, Entity>(inserted)

    console.log({ deserializedEntity })

    return deserializedEntity
  }

  async FindOne(query: Partial<Entity>, connection?: ConnectionPool | Transaction): Promise<Entity> {
    const dbConnection = connection || PgTypedDbConnection.db

    const serializedQuery = CaseSerializer.CastToSnake<Partial<Entity>, WhereCondition<DbEntity>>(query)

    Logger.info(`Executing query: FindOne with the following parameters\n${serializedQuery}`)

    const entity = await this.table(dbConnection).findOne(serializedQuery)

    console.log({ entity })

    return CaseSerializer.CastToCamel<DbEntity, Entity>(entity)
  }

  // async UpdateOne(
  //   query: WhereCondition<DbEntity>, model: Partial<DbEntity>, connection?: ConnectionPool | Transaction,
  // ): Promise<boolean> {
  //   const dbConnection = connection || PgTypedDbConnection.db

  //   const [updatedEntities] = await this.table(dbConnection).update(
  //     query,
  //     model,
  //   )

  //   return !!updatedEntities
  // }

  // async Delete(query: WhereCondition<DbEntity>, connection?: ConnectionPool | Transaction): Promise<void> {
  //   const dbConnection = connection || PgTypedDbConnection.db

  //   const del = await this.table(dbConnection).delete(query)
  // }

  // async FindAll(query: WhereCondition<DbEntity>, connection?: ConnectionPool | Transaction): Promise<DbEntity[]> {
  //   const dbConnection = connection || PgTypedDbConnection.db

  //   const entities = await this.table(dbConnection).find(query).all()

  //   return entities
  // }
}
