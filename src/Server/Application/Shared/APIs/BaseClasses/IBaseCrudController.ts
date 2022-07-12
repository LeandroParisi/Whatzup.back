import { Request } from 'express'
import { BaseEntity } from '../../../../Domain/Entities/BaseClasses/BaseEntity'
import BaseCrudServices from './BaseCrudServices'
import BaseResponse from './Responses/BaseResponse'

export default interface IBaseCrudController<Entity extends BaseEntity> {
  Service : BaseCrudServices<Entity>
  Get(query : any, req : Request) : Promise<Entity[]>
  Create(body : any, req : Request) : Promise<Entity>
  Update(body : any, req : Request, id? : number) : Promise<BaseResponse>
  Activate(req : Request, id? : number) : Promise<BaseResponse>
  Deactivate(req : Request, id? : number) : Promise<BaseResponse>
}
