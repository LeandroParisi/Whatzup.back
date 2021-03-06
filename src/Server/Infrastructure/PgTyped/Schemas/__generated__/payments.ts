/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: 0yZx3YFXezBTJVFi/BAQ+QxkhNXy19R0wTM65Xgx09eRfaZcOUkx0CNBygSizjoeOSnkheT1oAJ9pV1LJLPrVA==
 */

/* eslint-disable */
// tslint:disable

import UserPlan from './user_plan'

interface Payments {
  /**
   * @default '2022-06-24'::date
   */
  created_at: Date
  /**
   * @default nextval('payments_id_seq'::regclass)
   */
  id: number & {readonly __brand?: 'payments_id'}
  payment_date: (Date) | null
  reference_month: number
  reference_year: number
  send_date: (Date) | null
  /**
   * @default '2022-06-24'::date
   */
  updated_at: Date
  user_plan_id: (UserPlan['id']) | null
  was_paid: (boolean) | null
  was_sent: (boolean) | null
}
export default Payments;

interface Payments_InsertParameters {
  /**
   * @default '2022-06-24'::date
   */
  created_at?: Date
  /**
   * @default nextval('payments_id_seq'::regclass)
   */
  id?: number & {readonly __brand?: 'payments_id'}
  payment_date?: (Date) | null
  reference_month: number
  reference_year: number
  send_date?: (Date) | null
  /**
   * @default '2022-06-24'::date
   */
  updated_at?: Date
  user_plan_id?: (UserPlan['id']) | null
  was_paid?: (boolean) | null
  was_sent?: (boolean) | null
}
export type {Payments_InsertParameters}
