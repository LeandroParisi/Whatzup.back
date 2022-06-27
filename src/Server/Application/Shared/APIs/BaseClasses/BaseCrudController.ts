import {
  Body,
} from 'routing-controllers'
import { Service } from 'typedi'
import { BaseEntity } from '../../../../Domain/Entities/BaseClasses/BaseEntity'
import ApiError from '../../Errors/ApiError'
import { IBaseRepository } from '../../Repositories/IRepository'
import { StatusCode } from '../Enums/Status'

@Service()
export default abstract class BaseCrudController<Entity extends BaseEntity> {
  protected Repository : IBaseRepository<Entity>

  /**
   *
   */
  constructor(
    repository : IBaseRepository<Entity>,
  ) {
    this.Repository = repository
  }

  public async Create(@Body() body : Partial<Entity>) {
    try {
      const insertedEntity = await this.Repository.Create(body)
      return insertedEntity
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to insert entity', e)
    }
  }

  public Read() {
    return 'tete'
  }

  public Update() {

  }

  // @Delete()
  // public Delete() {

  // }
}
