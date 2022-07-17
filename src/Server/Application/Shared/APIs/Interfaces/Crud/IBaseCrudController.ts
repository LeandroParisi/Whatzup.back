/* eslint-disable import/export */
import { Request } from 'express'
import { BaseEntity } from '../../../../../Domain/Entities/BaseClasses/BaseEntity'
import BaseCrudServices from '../../BaseClasses/BaseCrudServices'
import BaseResponse from '../../BaseClasses/Responses/BaseResponse'

export interface IBaseCrudController<Entity extends BaseEntity> {
  Service : BaseCrudServices<Entity>
  Get(query : any, req : Request) : Promise<Entity[]>
  Create(body : any, req : Request) : Promise<Entity>
  Update(body : any, req : Request, id? : number) : Promise<BaseResponse>
}

export interface IBaseSoftDeleteController<Entity extends BaseEntity> {
  Service : BaseCrudServices<Entity>
  Activate(req : Request, id? : number) : Promise<BaseResponse>
  Deactivate(req : Request, id? : number) : Promise<BaseResponse>
}
