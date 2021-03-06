/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: zr31tnKqRqRqUW2kEqwGVOAKsTWzAxV7XvAx3x35EyHTkPmVRnZ4SlLZTR+FUgEP86mnnLWFX1c43RmE0e1fuQ==
 */

/* eslint-disable */
// tslint:disable

import DefaultPlans from './default_plans'
import Features from './features'
import PlanFeatureType from './plan_feature_type'

interface DefaultPlanFeature {
  /**
   * @default '2022-06-24'::date
   */
  created_at: Date
  default_plan_id: (DefaultPlans['id']) | null
  feature_id: (Features['id']) | null
  is_active: (boolean) | null
  max_limit: (number) | null
  type_id: (PlanFeatureType['id']) | null
  /**
   * @default '2022-06-24'::date
   */
  updated_at: Date
}
export default DefaultPlanFeature;

interface DefaultPlanFeature_InsertParameters {
  /**
   * @default '2022-06-24'::date
   */
  created_at?: Date
  default_plan_id?: (DefaultPlans['id']) | null
  feature_id?: (Features['id']) | null
  is_active?: (boolean) | null
  max_limit?: (number) | null
  type_id?: (PlanFeatureType['id']) | null
  /**
   * @default '2022-06-24'::date
   */
  updated_at?: Date
}
export type {DefaultPlanFeature_InsertParameters}
