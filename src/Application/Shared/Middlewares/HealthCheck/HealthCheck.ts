import { Response } from 'express'
import { Controller, Get, Res } from 'routing-controllers'
import { StatusCode } from '../../APIs/Enums/Status'

@Controller('/health')
export default class HealthCheck {
  @Get()
  ExecuteAsync(@Res() res : Response) {
    return res.status(StatusCode.OK).send('Alive')
  }
}
