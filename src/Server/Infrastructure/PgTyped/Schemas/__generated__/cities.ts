/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: y99wAtMHSbm1SLMESRoen894xxFT5WlwbrlM1aAc01wSiB0Q3E5gw9dVKKEYB0dVukA1Tfg76dtMks/85TPSjg==
 */

/* eslint-disable */
// tslint:disable

import States from './states'

interface Cities {
  /**
   * @default '2022-09-27'::date
   */
  created_at: Date
  /**
   * @default nextval('cities_id_seq'::regclass)
   */
  id: number & {readonly __brand?: 'cities_id'}
  /**
   * @default true
   */
  is_active: (boolean) | null
  name: string
  state_id: States['id']
  /**
   * @default '2022-09-27'::date
   */
  updated_at: Date
}
export default Cities;

interface Cities_InsertParameters {
  /**
   * @default '2022-09-27'::date
   */
  created_at?: Date
  /**
   * @default nextval('cities_id_seq'::regclass)
   */
  id?: number & {readonly __brand?: 'cities_id'}
  /**
   * @default true
   */
  is_active?: (boolean) | null
  name: string
  state_id: States['id']
  /**
   * @default '2022-09-27'::date
   */
  updated_at?: Date
}
export type {Cities_InsertParameters}
