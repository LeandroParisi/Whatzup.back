/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { SQLQuery } from '@databases/pg'
import { faker } from '@faker-js/faker'
import 'reflect-metadata'
import Bot from '../../../../../Server/Domain/Entities/Bot'
import City from '../../../../../Server/Domain/Entities/City'
import Country from '../../../../../Server/Domain/Entities/Country'
import Feature from '../../../../../Server/Domain/Entities/Feature'
import PlanFeature from '../../../../../Server/Domain/Entities/Pivot/PlanFeature'
import Plan from '../../../../../Server/Domain/Entities/Plan'
import State from '../../../../../Server/Domain/Entities/State'
import User from '../../../../../Server/Domain/Entities/User'
import CityMock from '../../../../Shared/Mocks/CityMock'
import CountryMock from '../../../../Shared/Mocks/CountryMock'
import PhoneNumberMock from '../../../../Shared/Mocks/PhoneNumberMock'
import StateMock from '../../../../Shared/Mocks/StateMock'
import UserMock from '../../../../Shared/Mocks/UserMock'
import { BotSetup } from './EntitiesSetup/BotSetup'
import { BotsPhoneNumbersSetup } from './EntitiesSetup/BotsPhoneNumbers'
import { CitySetup } from './EntitiesSetup/CitySetup'
import { CountrySetup } from './EntitiesSetup/CountrySetup'
import { FeatureSetup } from './EntitiesSetup/FeatureSetup'
import { PhoneNumberSetup } from './EntitiesSetup/PhoneNumberSetup'
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
  numberOfRandomFeaturesToCreate?: number
  features? : Partial<Feature & PlanFeature>[]
}

export interface FullPlanSetupReturn {
  plan : Plan
  features : Feature[]
}

export interface BasicUserBotSetupReturn {
  user : User
  state : State
  country : Country
  city : City
  bot : Bot
}

export default class DbSetup {
  public userSetup = new UserSetup()

  public stateSetup = new StateSetup()

  public citySetup = new CitySetup()

  public countrySetup = new CountrySetup()

  public botSetup = new BotSetup()

  public featureSetup = new FeatureSetup()

  public planSetup = new PlanSetup()

  public plansFeaturesSetup = new PlansFeaturesSetup()

  public phoneNumberSetup = new PhoneNumberSetup()

  public botsPhoneNumbersSetup = new BotsPhoneNumbersSetup()

  public async BasicUserSetup(params? : BasicUserSetupParams) : Promise<BasicUserSetupReturn> {
    const { state, city, country } = await this.BasicLocationsSetup(params)
    const { id: phoneNumberId } = await this.phoneNumberSetup.Create(PhoneNumberMock.GetRandom())
    const user = UserMock.GetRandomPartialUser(country.id, state.id, city.id, phoneNumberId)
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
      numberOfRandomFeaturesToCreate,
      features,
    } : FullPlanSetupParams,
  ) : Promise<FullPlanSetupReturn> {
    const createdPlan = await this.planSetup.InsertOnePlan(plan)

    let createdFeatures : Feature[] = []

    if (features) {
      createdFeatures = await this.featureSetup.CreateXFeatures({ features })

      for (const f of createdFeatures) {
        const { maxLimit } = features.find((x) => x.name === f.name)
        await this.plansFeaturesSetup.CreatePlanFeaturesRelation([f.id], createdPlan, { maxLimit })
      }
    } else {
      const numberOfFeatures = numberOfRandomFeaturesToCreate ?? faker.datatype.number({ max: 10 })
      createdFeatures = await this.featureSetup.CreateXFeatures({ randomFeaturesToCreate: numberOfFeatures })
      await this.plansFeaturesSetup.CreatePlanFeaturesRelation(createdFeatures.map((f) => f.id), createdPlan)
    }

    return { plan: createdPlan, features: createdFeatures }
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
    await this.plansFeaturesSetup.CreatePlanFeaturesRelation(
      [createdPhonesFeature.id], createdPlan, { maxLimit: phonesLimit },
    )

    return {
      plan: createdPlan,
      features: [
        createdBotFeature,
        createdStepFeature,
        createdPhonesFeature,
      ],
    }
  }

  public async BasicUserBotSetup(userSetupParams? : BasicUserSetupParams, bot? : Bot) : Promise<BasicUserBotSetupReturn> {
    const {
      user,
      state,
      country,
      city,
    } = await this.BasicUserSetup(userSetupParams)

    const insertedBot = await this.botSetup.InsertOne(bot || { userId: user.id })

    return {
      user,
      state,
      country,
      city,
      bot: insertedBot,
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
      await this.botsPhoneNumbersSetup.CleanUp()
      await this.botSetup.CleanUp()
      await this.plansFeaturesSetup.CleanUp()
      await this.featureSetup.CleanUp()
      await this.userSetup.CleanUp()
      await this.phoneNumberSetup.CleanUp()
      await this.planSetup.CleanUp()
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
