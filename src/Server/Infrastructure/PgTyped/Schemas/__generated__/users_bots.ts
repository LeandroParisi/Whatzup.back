/**
 * !!! This file is autogenerated do not edit by hand !!!
 *
 * Generated by: @databases/pg-schema-print-types
 * Checksum: bqqC4m6PFWC+C41YJhO/Qm9Xa/HtZBLSIIg23/sAO3cSOC+Py8ghtxNYs0jVjpsTbtHHDEFCzMwcu0By2w1t4g==
 */

/* eslint-disable */
// tslint:disable

import Bots from './bots'
import Users from './users'

interface UsersBots {
  bot_id: (Bots['id']) | null
  user_id: (Users['id']) | null
}
export default UsersBots;

interface UsersBots_InsertParameters {
  bot_id?: (Bots['id']) | null
  user_id?: (Users['id']) | null
}
export type {UsersBots_InsertParameters}