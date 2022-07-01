/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: oyg8+A0ctn7gcZHejtnCf5YMph+qp9TICSrGEP6iydgGqxjKd8RachL8FjyvIk9DdgAU5gtjWNR0dOk4O2xx2w==
 */

/* eslint-disable */
// tslint:disable

import Features from './features'
import Plans from './plans'

interface PlansFeatures {
  feature_id: Features['id']
  max_limit: (number) | null
  plan_id: Plans['id']
}
export default PlansFeatures;

interface PlansFeatures_InsertParameters {
  feature_id: Features['id']
  max_limit?: (number) | null
  plan_id: Plans['id']
}
export type {PlansFeatures_InsertParameters}
