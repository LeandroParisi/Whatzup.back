import { Service } from 'typedi'
import { BaseEntity } from '../../../../Domain/Entities/BaseClasses/BaseEntity'
import { IBaseRepository } from '../../Database/Repositories/IRepository'
import ApiError from '../../Errors/ApiError'
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

  public async FindOne(body : Partial<Entity>) {
    try {
      const entity = await this.Repository.FindOne(body)
      return entity
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, `Unable to locate entity ${body.id}`, e)
    }
  }

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
      const isUpdated = await this.Repository.UpdateOne({ ...additionalQuery, id, isActive: true }, deactivate)
      return isUpdated
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to update entity', e)
    }
  }

  public async Activate(id : number, additionalQuery? : Partial<Entity>) : Promise<boolean> {
    try {
      const activate = { isActive: true } as Partial<Entity>
      const isUpdated = await this.Repository.UpdateOne({ ...additionalQuery, id, isActive: false }, activate)
      return isUpdated
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to update entity', e)
    }
  }

  protected CleanEntity(model: Partial<Entity>) : Partial<Entity> {
    const entity = { ...model }

    Object.entries(entity).forEach(([key, value]) => {
      if (!value && value !== 0) {
        delete entity[key]
      }
    })

    return entity
  }
  // public Delete() {

  // }
}
