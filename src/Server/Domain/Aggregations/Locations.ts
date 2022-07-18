import City from '../Entities/City'
import Country from '../Entities/Country'
import State from '../Entities/State'

export interface Locations {
  country : Country
  state : State
  city : City
}
