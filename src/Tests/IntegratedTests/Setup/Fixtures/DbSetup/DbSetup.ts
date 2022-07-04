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

export interface FullPlanSetupParams {
  plan? : Partial<Plan>,
  featuresToCreate?: number
  features? : Partial<Feature>[]
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
      plan,
      featuresToCreate,
    } : FullPlanSetupParams,
  ) : Promise<FullPlanSetupReturn> {
    const createdPlan = await this.planSetup.InsertOnePlan(plan)
    const numberOfFeatures = featuresToCreate ?? faker.datatype.number({ max: 10 })
    const features = await this.featureSetup.CreateXFeatures(numberOfFeatures)

    await this.plansFeaturesSetup.CreatePlanFeaturesRelation(features.map((f) => f.id), createdPlan)

    return { plan: createdPlan, features }
  }

  public async DefaultPlanSetup() : Promise<FullPlanSetupReturn> {
    const createdPlan = await this.planSetup.InsertOnePlan({ isCustomPlan: false })

    const { feature: botFeature, limit: botLimit } = FeatureSetup.NUMBER_OF_BOTS_FEATURE
    const { feature: stepsFeature, limit: stepsLimit } = FeatureSetup.MAX_STEPS_FEATURE
    const { feature: phonesFeature, limit: phonesLimit } = FeatureSetup.PHONES_PER_BOT

    const createdBotFeature = await this.featureSetup.Create({ ...botFeature })
    const createdStepFeature = await this.featureSetup.Create({ ...stepsFeature })
    const createdPhonesFeature = await this.featureSetup.Create({ ...phonesFeature })

    await this.plansFeaturesSetup.CreatePlanFeaturesRelation([createdBotFeature.id], createdPlan, { maxLimit: botLimit })
    await this.plansFeaturesSetup.CreatePlanFeaturesRelation([createdStepFeature.id], createdPlan, { maxLimit: stepsLimit })
    await this.plansFeaturesSetup.CreatePlanFeaturesRelation([phonesFeature.id], createdPlan, { maxLimit: phonesLimit })

    return {
      plan: createdPlan,
      features: [
        createdBotFeature,
        createdStepFeature,
      ],
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
