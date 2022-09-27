/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: BwB3i7Co5EYHzC1uQrg3pTpjvS4l61nTxgHjjj4pXm8LDl0rjpVWaUhOdMZ0ZXJzWntPgQe1MXLNKl0Cwk/2zg==
 */

/* eslint-disable */
// tslint:disable

interface Plans {
  /**
   * @default '2022-09-27'::date
   */
  created_at: Date
  /**
   * @default nextval('plans_id_seq'::regclass)
   */
  id: number & {readonly __brand?: 'plans_id'}
  /**
   * @default true
   */
  is_active: (boolean) | null
  is_custom_plan: boolean
  name: (string) | null
  price: string
  /**
   * @default '2022-09-27'::date
   */
  updated_at: Date
}
export default Plans;

interface Plans_InsertParameters {
  /**
   * @default '2022-09-27'::date
   */
  created_at?: Date
  /**
   * @default nextval('plans_id_seq'::regclass)
   */
  id?: number & {readonly __brand?: 'plans_id'}
  /**
   * @default true
   */
  is_active?: (boolean) | null
  is_custom_plan: boolean
  name?: (string) | null
  price: string
  /**
   * @default '2022-09-27'::date
   */
  updated_at?: Date
}
export type {Plans_InsertParameters}
