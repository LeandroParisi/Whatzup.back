import {
  Body,
  Controller,
  Get,
  Post,
} from 'routing-controllers'
import { Service } from 'typedi'
import { BaseEntity } from '../../../../Domain/Entities/BaseClasses/BaseEntity'
import ApiError from '../../Errors/ApiError'
import { Connections, IBaseRepository } from '../../Repositories/IRepository'
import { StatusCode } from '../Enums/Status'

export interface ControllerActionOptions {
  connection? : Connections
}

@Service()
@Controller('BASE_CRUD')
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

  @Post('/BASE_CRUD')
  public async Create(@Body() body : Partial<Entity>, actionOptions? : ControllerActionOptions) {
    try {
      const insertedEntity = await this.Repository.Create({ ...body, created_at: Date.now() }, actionOptions.connection)
      return insertedEntity
    } catch (e) {
      throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, 'Unable to insert entity', e)
    }
  }

  // @Get()
  // public Read() {

  // }

  // @Put()
  // public Update() {

  // }

  // @Delete()
  // public Delete() {

  // }
}
