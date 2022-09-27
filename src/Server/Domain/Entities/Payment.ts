import { sql } from '@databases/pg'
import { Service } from 'typedi'
import { KeysOf } from '../../../Commons/Interfaces/SystemInterfaces/EnumTypes'
import { Payments } from '../../Infrastructure/PgTyped/Schemas/__generated__'
import { PaymentType } from '../Enums/PaymentType'
import { BaseEntity } from './BaseClasses/BaseEntity'

@Service()
export default class Payment extends BaseEntity {
  planId : number

  userId : number

  type : PaymentType

  referenceYear : number

  referenceMonth : number

  wasSent? : boolean

  sendDate? : Date

  wasPaid? : boolean

  paymentDate? : Date

  dueDate : Date

  createdAt : Date

  updatedAt : Date
}

export const PaymentsColumns : KeysOf<Payments> = {
  id: sql.ident('id'),
  type: sql.ident('type'),
  created_at: sql.ident('created_at'),
  payment_date: sql.ident('payment_date'),
  plan_id: sql.ident('plan_id'),
  reference_month: sql.ident('reference_month'),
  reference_year: sql.ident('reference_year'),
  send_date: sql.ident('send_date'),
  updated_at: sql.ident('updated_at'),
  user_id: sql.ident('user_id'),
  was_paid: sql.ident('was_paid'),
  was_sent: sql.ident('was_sent'),
  due_date: sql.ident('due_date'),
}
