/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: rcZHHAfS79A40QF2eLVe0HYq8oXzQ33rBuLyWse3conVtCYmR1Q4B5mKAzLe/cUkPoylWJtNoaLAQ84CXtbmYw==
 */

/* eslint-disable */
// tslint:disable

import CustomPlans from './custom_plans'
import DefaultPlans from './default_plans'
import Users from './users'

interface UserPlan {
  /**
   * @default '2022-06-24'::date
   */
  created_at: Date
  custom_plan_id: (CustomPlans['id']) | null
  default_plan_id: (DefaultPlans['id']) | null
  /**
   * @default nextval('user_plan_id_seq'::regclass)
   */
  id: number & {readonly __brand?: 'user_plan_id'}
  is_active: (boolean) | null
  is_custom_plan: (boolean) | null
  /**
   * @default '2022-06-24'::date
   */
  updated_at: Date
  user_id: (Users['id']) | null
}
export default UserPlan;

interface UserPlan_InsertParameters {
  /**
   * @default '2022-06-24'::date
   */
  created_at?: Date
  custom_plan_id?: (CustomPlans['id']) | null
  default_plan_id?: (DefaultPlans['id']) | null
  /**
   * @default nextval('user_plan_id_seq'::regclass)
   */
  id?: number & {readonly __brand?: 'user_plan_id'}
  is_active?: (boolean) | null
  is_custom_plan?: (boolean) | null
  /**
   * @default '2022-06-24'::date
   */
  updated_at?: Date
  user_id?: (Users['id']) | null
}
export type {UserPlan_InsertParameters}
