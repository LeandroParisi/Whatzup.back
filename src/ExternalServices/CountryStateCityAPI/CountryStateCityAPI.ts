import { Service } from 'typedi'
import Api from '../../Commons/Api'
import CONSTANTS from '../../Commons/Configuration/constants'
import { GetAllCitiesResponse } from './Reponses/GetAllCitiesResponse'
import { GetAllCountriesResponse } from './Reponses/GetAllCountriesResponse'

@Service()
export default class CountryStateCityAPI extends Api {
  protected BaseUrl: string;

  /**
   *
   */
  constructor() {
    super()
    this.BaseUrl = 'https://api.countrystatecity.in/v1/'
  }

  public async GetAllCountries() {
    const countries = await this.Request<GetAllCountriesResponse>({
      endpoint: 'countries',
      headers: {
        'X-CSCAPI-KEY': CONSTANTS.COUNTRY_STATE_CITY_API_KEY,
      },
      method: 'GET',
    })

    return countries
  }

  public async GetStatesByCountry(countryIso : string) {
    const countries = await this.Request<GetAllCountriesResponse>({
      endpoint: `countries/${countryIso}/states`,
      headers: {
        'X-CSCAPI-KEY': CONSTANTS.COUNTRY_STATE_CITY_API_KEY,
      },
      method: 'GET',
    })

    return countries
  }

  public async GetCitiesByStateAndCountry(countryIso : string, stateIso : string) {
    const countries = await this.Request<GetAllCitiesResponse>({
      endpoint: `countries/${countryIso}/states/${stateIso}/cities`,
      headers: {
        'X-CSCAPI-KEY': CONSTANTS.COUNTRY_STATE_CITY_API_KEY,
      },
      method: 'GET',
    })

    return countries
  }
}
