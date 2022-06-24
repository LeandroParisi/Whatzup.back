// import { injectable } from 'inversify'
// import { IBaseRepository } from '../../Domain/Interfaces/IRepository'
// import ApiError from '../Shared/Abstractions/ApiError'
// import { StatusCode } from '../Shared/APIs/Enums/Status'
// import { Serializers } from './Helpers/Serializers'
// import { ICrudService } from './Interfaces/ICrudService'

// @injectable()
// export abstract class CrudServices<DomainModel, DbEntity> implements ICrudService<DomainModel> {
//   private Repository : IBaseRepository<DbEntity>

//   /**
//    *
//    */
//   constructor(repository : IBaseRepository<DbEntity>) {
//     this.Repository = repository
//   }

//   async Create(model: Partial<DomainModel>): Promise<DomainModel> {
//     const dbModel = Serializers.CastToSnake<Partial<DomainModel>, DbEntity>(model)
//     const insertedEntity = await this.Repository.Create(dbModel)
//     return Serializers.CastToCamel<DomainModel, DbEntity>(insertedEntity) as DomainModel
//   }

//   async Update(query: Partial<DomainModel>, model: Partial<DomainModel>): Promise<boolean> {
//     const dbModel = Serializers.CastToSnake<Partial<DomainModel>, DbEntity>(model)
//     const dbQuery = Serializers.CastToSnake<Partial<DomainModel>, DbEntity>(query)

//     const isUpdated = await this.Repository.UpdateOne(dbModel, dbQuery)

//     if (isUpdated) {
//       return isUpdated
//     }

//     throw new ApiError(StatusCode.NOT_FOUND, 'Unable to updated requested entity, it probably does not exist')
//   }

//   async Delete(query: Partial<DomainModel>): Promise<void> {
//     const dbQuery = Serializers.CastToSnake<Partial<DomainModel>, DbEntity>(query)

//     const isUpdated = await this.Repository.Delete(dbQuery)
//     console.log({ isUpdated })
//   }

//   async FindOne(query: Partial<DomainModel>): Promise<DomainModel> {
//     const dbQuery = Serializers.CastToSnake<Partial<DomainModel>, DbEntity>(query)

//     const entity = await this.Repository.FindOne(dbQuery)

//     return Serializers.CastToCamel<DomainModel, DbEntity>(entity) as DomainModel
//   }

//   async FindAll(query: Partial<DomainModel>): Promise<DomainModel[]> {
//     const dbQuery = Serializers.CastToSnake<Partial<DomainModel>, DbEntity>(query)

//     const entities = await this.Repository.FindOne(dbQuery)

//     return Serializers.CastToCamel<DomainModel, DbEntity>(entities) as DomainModel[]
//   }
// }
