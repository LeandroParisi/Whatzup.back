import {
  Body,
  Controller,
  Post,
} from 'routing-controllers'
import { Service } from 'typedi'
import {
  BaseEntity, DeepPartial, Repository,
} from 'typeorm'

@Service()
@Controller('BASE_CRUD')
export default abstract class BaseCrudController<Entity extends BaseEntity> {
  private Repository : Repository<Entity>;

  /**
   *
   */
  constructor(
    protected repository : Repository<Entity>,
  ) {
    this.Repository = repository
  }

  @Post('/BASE_CRUD')
  public async Create(@Body() body : DeepPartial<Entity>) {
    console.log({ tete: this.repository })
    console.log({ tete2: this.Repository })

    const repository = await this.Repository.find()
    // await this.repository.save(body)
    // const entity = AppDataSource.manager.create<Entity>(this.EntityType, body)
    // await AppDataSource.manager.save(entity)
    return body
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
