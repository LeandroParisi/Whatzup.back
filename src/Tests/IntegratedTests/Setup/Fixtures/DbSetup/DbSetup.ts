import 'reflect-metadata'
import City from '../../../../../Server/Domain/Entities/City'
import Country from '../../../../../Server/Domain/Entities/Country'
import State from '../../../../../Server/Domain/Entities/State'
import User from '../../../../../Server/Domain/Entities/User'
import CityMock from '../../../../Shared/Mocks/CityMock'
import CountryMock from '../../../../Shared/Mocks/CountryMock'
import StateMock from '../../../../Shared/Mocks/StateMock'
import UserMock from '../../../../Shared/Mocks/UserMock'
import { CitySetup } from './EntitiesSetup/CitySetup'
import { CountrySetup } from './EntitiesSetup/CountrySetup'
import { StateSetup } from './EntitiesSetup/StateSetup'
import { UserSetup } from './EntitiesSetup/UserSetup'

export interface BasicUserSetupParams {
  user? : Partial<User>
  state? : Partial<State>
  country? : Partial<Country>
  city? : Partial<City>
}
export interface BasicLocationsSetupParams {
  state? : Partial<State>
  country? : Partial<Country>
  city? : Partial<City>
}
export interface BasicUserSetupReturn {
  user : User
  state : State
  country : Country
  city : City
}
export interface BasicLocationsSetupReturn {
  state : State
  country : Country
  city : City
}

export default class DbSetup {
  public userSetup : UserSetup

  public stateSetup : StateSetup

  public citySetup : CitySetup

  public countrySetup : CountrySetup

  /**
   *
   */
  constructor() {
    this.userSetup = new UserSetup()
    this.stateSetup = new StateSetup()
    this.citySetup = new CitySetup()
    this.countrySetup = new CountrySetup()
  }

  public async BasicUserSetup(params? : BasicUserSetupParams) : Promise<BasicUserSetupReturn> {
    const { state, city, country } = await this.BasicLocationsSetup(params)
    const user = UserMock.GetRandomPartialUser(country.id, state.id, city.id)
    const userToInsert = params?.user ? {
      ...user, ...params.user, stateId: state.id, countryId: country.id, cityId: city.id,
    } : user

    const addedUser = await this.userSetup.Create(userToInsert)

    return {
      user: addedUser,
      state,
      country,
      city,
    }
  }

  public async BasicLocationsSetup(params? : BasicLocationsSetupParams) : Promise<BasicLocationsSetupReturn> {
    const cityToAdd = params?.city ?? CityMock.GetRandom()
    const addedCity = await this.citySetup.Create(cityToAdd)

    const countryToAdd = params?.country ?? CountryMock.GetRandom()
    const addedCountry = await this.countrySetup.Create(countryToAdd)

    const stateToAdd = params?.state ?? StateMock.GetRandom({ countryId: addedCountry.id })
    const addedState = await this.stateSetup.Create(stateToAdd)

    return {
      state: addedState,
      country: addedCountry,
      city: addedCity,
    }
  }

  public async CleanUp() {
    await this.userSetup.CleanUp()
    await this.citySetup.CleanUp()
    await this.stateSetup.CleanUp()
    await this.countrySetup.CleanUp()
  }
}
