/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: rb11cbx5wxfLNj/gRbWW827uvld3+fWirRmPad96KGOceApmeMAG1aSJlChiVCuRHPyPLLcPUDGgTzLnDuGcFg==
 */

/* eslint-disable */
// tslint:disable

interface Features {
  /**
   * @default '2022-07-12'::date
   */
  created_at: Date
  /**
   * @default nextval('features_id_seq'::regclass)
   */
  id: number & {readonly __brand?: 'features_id'}
  is_active: (boolean) | null
  name: string
  type: string
  /**
   * @default '2022-07-12'::date
   */
  updated_at: Date
}
export default Features;

interface Features_InsertParameters {
  /**
   * @default '2022-07-12'::date
   */
  created_at?: Date
  /**
   * @default nextval('features_id_seq'::regclass)
   */
  id?: number & {readonly __brand?: 'features_id'}
  is_active?: (boolean) | null
  name: string
  type: string
  /**
   * @default '2022-07-12'::date
   */
  updated_at?: Date
}
export type {Features_InsertParameters}
