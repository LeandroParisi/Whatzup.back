/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { SQLQuery } from '@databases/pg'
import { faker } from '@faker-js/faker'
import 'reflect-metadata'
import City from '../../../../../Server/Domain/Entities/City'
import Country from '../../../../../Server/Domain/Entities/Country'
import Feature from '../../../../../Server/Domain/Entities/Feature'
import Plan from '../../../../../Server/Domain/Entities/Plan'
import State from '../../../../../Server/Domain/Entities/State'
import User from '../../../../../Server/Domain/Entities/User'
import CityMock from '../../../../Shared/Mocks/CityMock'
import CountryMock from '../../../../Shared/Mocks/CountryMock'
import FeatureMock from '../../../../Shared/Mocks/FeatureMock'
import PlanMock from '../../../../Shared/Mocks/PlanMock'
import StateMock from '../../../../Shared/Mocks/StateMock'
import UserMock from '../../../../Shared/Mocks/UserMock'
import { BotSetup } from './EntitiesSetup/BotSetup'
import { CitySetup } from './EntitiesSetup/CitySetup'
import { CountrySetup } from './EntitiesSetup/CountrySetup'
import { FeatureSetup } from './EntitiesSetup/FeatureSetup'
import { PlanSetup } from './EntitiesSetup/PlanSetup'
import { PlansFeaturesSetup } from './EntitiesSetup/PlansFeaturesSetup'
import { StateSetup } from './EntitiesSetup/StateSetup'
import { UserSetup } from './EntitiesSetup/UserSetup'
import { TestDbConnection } from './TestDbConnection'

export interface BasicUserSetupParams {
  user? : Partial<User>
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

export interface BasicLocationsSetupParams {
  state? : Partial<State>
  country? : Partial<Country>
  city? : Partial<City>
}

export interface BasicLocationsSetupReturn {
  state : State
  country : Country
  city : City
}

export interface BasicFeatureSetupParams {
  feature? : Partial<Feature>
}

export interface BasicFeatureSetupReturn {
  feature : Feature
}

export interface BasicPlanSetupParams {
  plan? : Partial<Plan>
}

export interface BasicPlanSetupReturn {
  plan : Plan
}

export interface FullPlanSetupReturn {
  plan : Plan
  features : Feature[]
}

export default class DbSetup {
  public userSetup : UserSetup

  public stateSetup : StateSetup

  public citySetup : CitySetup

  public countrySetup : CountrySetup

  public botSetup : BotSetup

  public featureSetup : FeatureSetup

  public planSetup : PlanSetup

  public plansFeaturesSetup : PlansFeaturesSetup

  /**
   *
   */
  constructor() {
    this.userSetup = new UserSetup()
    this.stateSetup = new StateSetup()
    this.citySetup = new CitySetup()
    this.countrySetup = new CountrySetup()
    this.botSetup = new BotSetup()
    this.featureSetup = new FeatureSetup()
    this.planSetup = new PlanSetup()
    this.plansFeaturesSetup = new PlansFeaturesSetup()
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

  public async FullPlanSetup(
    {
      planParams,
      featuresToCreate,
    } :
    {
      planParams? : BasicPlanSetupParams,
      featuresToCreate?: number
    },
  ) : Promise<FullPlanSetupReturn> {
    const { plan } = await this.BasicPlanSetup(planParams)
    const numberOfFeatures = featuresToCreate ?? faker.datatype.number({ max: 10 })
    const features = await this.CreateXFeatures(numberOfFeatures)

    for (const f of features) {
      await this.plansFeaturesSetup.Create({ planId: plan.id, featureId: f.feature.id })
    }

    return { plan, features: features.map((f) => f.feature) }
  }

  public async BasicPlanFeatureSetup(featureIds : number[], params? : BasicPlanSetupParams) : Promise<void> {
    const { plan } = await this.BasicPlanSetup(params)

    for (const featureId of featureIds) {
      const { feature } = await this.BasicFeatureSetup({ feature: { id: featureId } })
      await this.plansFeaturesSetup.Create({ planId: plan.id, featureId: feature.id })
    }
  }

  public async BasicPlanSetup(params? : BasicPlanSetupParams) : Promise<BasicPlanSetupReturn> {
    const plan = params?.plan ? PlanMock.GetRandom(params.plan) : PlanMock.GetRandom()

    const insertedPlan = await this.planSetup.Create(plan)

    return {
      plan: insertedPlan,
    }
  }

  public async BasicFeatureSetup(params? : BasicFeatureSetupParams) : Promise<BasicFeatureSetupReturn> {
    const feature = params?.feature
      ? FeatureMock.GetRandom(params.feature)
      : FeatureMock.GetRandom()

    const insertedfeature = await this.featureSetup.Create(feature)

    return {
      feature: insertedfeature,
    }
  }

  public async CreateXFeatures(featuresToCreate : number) : Promise<BasicFeatureSetupReturn[]> {
    const output : BasicFeatureSetupReturn[] = []

    for (let i = 1; i <= featuresToCreate; i += 1) {
      const feature = await this.BasicFeatureSetup()
      output.push(feature)
    }

    return output
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

  public async ExecuteQuery<T>(query : SQLQuery) : Promise<T> {
    return await TestDbConnection.db.query(query) as unknown as T
  }

  public async CleanUp() {
    try {
      await this.plansFeaturesSetup.CleanUp()
      await this.planSetup.CleanUp()
      await this.featureSetup.CleanUp()
      await this.botSetup.CleanUp()
      await this.userSetup.CleanUp()
      await this.citySetup.CleanUp()
      await this.stateSetup.CleanUp()
      await this.countrySetup.CleanUp()
    } catch (e) {
      const error = e as Error
      console.log('Failed to clean up test info\n')
      console.log(`${error.message}\n`)
      console.log('TODO: Solve this in the future, since db will be all cleaned after all tests\n')
    }
  }
}
