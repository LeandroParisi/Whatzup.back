/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-await */
import {
  Body,
  JsonController,
  Post,
} from 'routing-controllers'
import Container, { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository, Container as OrmContainer } from 'typeorm-typedi-extensions'
import User from '../../../../../Domain/Entities/User'
import BaseCrudController from '../../../../Shared/APIs/BaseClasses/BaseCrudController'
import ErrorHandler from '../../../../Shared/Middlewares/ErrorHandler/ErrorHandler'
import CreateUserRequest from './Requests/CreateUserRequest'

@Service()
@JsonController('/user')
export default class UserController extends BaseCrudController<User> {
  /**
   *
   */
  constructor(
    private r : UserRepository,
    @InjectRepository(User) tt : Repository<User>,
  ) {
    super(r)
    console.log({ tt })
  }

  @Post('/teste')
  public async Create(@Body() body : CreateUserRequest) : Promise<CreateUserRequest> {
    console.log({ UserController: this.r })

    return await super.Create(body)
  }
}

@Service()
class UserRepository extends Repository<User> {

}
