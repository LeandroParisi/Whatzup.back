import { Service } from 'typedi'
import { BaseEntity } from '../../../../Domain/Entities/BaseClasses/BaseEntity'
import ApiError from '../../Errors/ApiError'
import { IBaseRepository } from '../../Repositories/IRepository'
import { StatusCode } from '../Enums/Status'

@Service()
export default class BaseCrudServices<Entity extends BaseEntity> {
  protected Repository : IBaseRepository<Entity>

  /**
   *
   */
  constructor(
    repository : IBaseRepository<Entity>,
  ) {
    this.Repository = repository
  }

  public async Create(body : Partial<Entity>) {
    try {
      const insertedEntity = await this.Repository.Create(body)
      return insertedEntity
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to insert entity', e)
    }
  }

  // public Read() {
  //   return 'tete'
  // }

  public async Update(query : Partial<Entity>, fieldsToUpdate : Partial<Entity>) : Promise<boolean> {
    try {
      const isUpdated = await this.Repository.UpdateOne(query, fieldsToUpdate)
      return isUpdated
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to update entity', e)
    }
  }

  public async Deactivate(id : number, additionalQuery? : Partial<Entity>) : Promise<boolean> {
    try {
      const deactivate = { isActive: false } as Partial<Entity>
      const isUpdated = await this.Repository.UpdateOne({ ...additionalQuery, id }, deactivate)
      return isUpdated
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to update entity', e)
    }
  }

  public async Activate(id : number, additionalQuery? : Partial<Entity>) : Promise<boolean> {
    try {
      const deactivate = { isActive: true } as Partial<Entity>
      const isUpdated = await this.Repository.UpdateOne({ ...additionalQuery, id }, deactivate)
      return isUpdated
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to update entity', e)
    }
  }
  // public Delete() {

  // }
}
