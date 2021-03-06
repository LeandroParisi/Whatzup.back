/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { TableHelper, WhereCondition } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections } from '../../../../../../Server/Application/Shared/Repositories/IRepository'
import { CaseSerializer } from '../../../../../../Server/Commons/Globals/Serializers/CaseSerializer'
import { BaseEntity } from '../../../../../../Server/Domain/Entities/BaseClasses/BaseEntity'
import { TestDbConnection } from '../TestDbConnection'

@Service()
export abstract class BaseEntitySetup<
    Entity extends BaseEntity,
    DbEntity,
    DbInsertableEntity
  > {
  abstract table : TableHelper<DbEntity, DbInsertableEntity, 'defaultConnection'>

  public EntitiesToDispose : Array<Entity> = []

  async Create(model: Partial<Entity>, connection?: Connections): Promise<Entity> {
    const dbConnection = connection || TestDbConnection.db

    const serializedEntity = CaseSerializer.CastToSnake<Partial<Entity>, DbInsertableEntity>(model)

    const [inserted] = await this.table(dbConnection).insert(serializedEntity)

    const deserializedEntity = CaseSerializer.CastToCamel<DbEntity, Entity>(inserted)

    this.EntitiesToDispose.push(deserializedEntity)

    return deserializedEntity
  }

  async FindOne(query: Partial<Entity>, connection?: Connections): Promise<Entity> {
    const dbConnection = connection || TestDbConnection.db

    const serializedQuery = CaseSerializer.CastToSnake<Partial<Entity>, WhereCondition<DbEntity>>(query)

    const entity = await this.table(dbConnection).findOne(serializedQuery)

    return CaseSerializer.CastToCamel<DbEntity, Entity>(entity)
  }

  async Delete(query: Partial<Entity>, connection?: Connections): Promise<void> {
    const dbConnection = connection || TestDbConnection.db

    const serializedQuery = CaseSerializer.CastToSnake<Partial<Entity>, WhereCondition<DbEntity>>(query)

    await this.table(dbConnection).delete(serializedQuery)
  }

  async DeleteById(id : number, connection?: Connections): Promise<void> {
    const dbConnection = connection || TestDbConnection.db

    await this.table(dbConnection).delete({ id } as unknown as WhereCondition<DbEntity>)
  }

  async CleanUp() : Promise<void> {
    for (const entity of this.EntitiesToDispose) {
      await this.PreCleanUp(entity)
      await this.DeleteById(entity.id)
    }
  }

  async PreCleanUp(_entity : Entity) {
    // If necessary to make a pre clean up for an entity, ex.: when it has related data on pivot tables
  }
}
