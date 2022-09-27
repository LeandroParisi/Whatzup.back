/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { sql } from '@databases/pg'
import { TableHelper } from '@databases/pg-typed'
import { Service } from 'typedi'
import { Connections } from '../../../Application/Shared/Database/Repositories/IRepository'
import { CaseSerializer } from '../../../Application/Shared/Serializers/CaseSerializer'
import Payment, { PaymentsColumns } from '../../../Domain/Entities/Payment'
import { PgTypedDbConnection } from '../PostgresTypedDbConnection'
import { Payments as PaymentsDbModel, Payments_InsertParameters } from '../Schemas/__generated__'
import { BaseRepository } from './BaseRepository'

@Service()
export class PaymentRepository extends BaseRepository<Payment, PaymentsDbModel, Payments_InsertParameters> {
  table: TableHelper<PaymentsDbModel, Payments_InsertParameters, 'defaultConnection'>

  /**
   *
   */
  constructor() {
    super()
    this.table = PgTypedDbConnection.tables.payments
  }

  public async GetLastUserPayment(userId : number, connection?: Connections) : Promise<Payment | null> {
    const dbConnection = connection || PgTypedDbConnection.db

    const lastPayment = await dbConnection.query(sql`
      SELECT
        *
      FROM payments AS p
      WHERE p.${PaymentsColumns.user_id} = ${userId}
      ORDER BY ${PaymentsColumns.reference_year} DESC, ${PaymentsColumns.reference_month}
      LIMIT 1
    `)

    const response = CaseSerializer.CastToCamel<PaymentsDbModel[], Payment[]>(lastPayment)

    if (lastPayment.length === 1) return response[0]

    return null
  }
}
