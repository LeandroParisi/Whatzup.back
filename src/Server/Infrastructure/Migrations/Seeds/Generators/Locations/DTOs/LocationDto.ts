/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */

import City from '../../../../../../Domain/Entities/City'
import Country from '../../../../../../Domain/Entities/Country'
import State from '../../../../../../Domain/Entities/State'

export class LocationsDTO {
  countries : Country[]

  states : State[]

  cities : City[]
}
