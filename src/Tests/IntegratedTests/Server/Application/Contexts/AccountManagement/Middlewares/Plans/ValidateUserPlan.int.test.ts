/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
import { faker } from '@faker-js/faker'
import { getMockReq, getMockRes } from '@jest-mock/express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import { CreateBotStepPath } from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/BotController/Requests/CreateBot/CreateBotRequest'
import ValidateUserPlan from '../../../../../../../../Server/Application/Contexts/AccountManagement/Middlewares/Plans/ValidateUserPlan'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../../../../../Server/Application/Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../../../../../../Server/Application/Shared/Errors/ApiError'
import { InexistentUserError } from '../../../../../../../../Server/Application/Shared/Errors/SpecificErrors/InexistentUserError'
import Bot from '../../../../../../../../Server/Domain/Entities/Bot'
import { Step } from '../../../../../../../../Server/Domain/Entities/Steps/Step'
import { FeatureNames } from '../../../../../../../../Server/Domain/Enums/FeatureNames'
import { FeatureTypes } from '../../../../../../../../Server/Domain/Enums/FeatureTypes'
import BotMock from '../../../../../../../Shared/Mocks/BotMock'
import PlanMock from '../../../../../../../Shared/Mocks/PlanMock'
import StepMock from '../../../../../../../Shared/Mocks/StepMock'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'

describe('Validate user plan middleware integrated test', () => {
  let dbSetup : DbSetup
  const { res, next, mockClear } = getMockRes()

  enum PossibleErrors {
    InvalidRequest,
    InvalidUser,
    UserWithoutPlan,
    BotLimitReached,
    StepLimitReached
  }

  const invalidScenarioTheory = [
    PossibleErrors.InvalidRequest,
    PossibleErrors.InvalidUser,
    PossibleErrors.UserWithoutPlan,
    PossibleErrors.BotLimitReached,
    PossibleErrors.StepLimitReached,
  ]

  const validScenarioTheory = [
    { currentBots: 2, allowedBotSteps: 2 },
    { currentBots: 3, allowedBotSteps: 5 },
    { currentBots: 1, allowedBotSteps: 1 },
  ]

  beforeEach(() => {
    dbSetup = new DbSetup()
  })

  afterEach(async () => {
    await dbSetup.CleanUp()
    mockClear()
  })

  theoretically('1. Should properlly validate user plan if it is valid', validScenarioTheory, async ({ allowedBotSteps, currentBots }) => {
    // Arrange
    const userId = await SetupValidScenario(currentBots, allowedBotSteps)
    const { steps } = CreateBot(userId, allowedBotSteps)

    const req = getMockReq({ user: { id: userId }, body: { steps } }) as unknown as IAuthenticatedRequest

    // Act
    try {
      const middleware = ValidateUserPlan({ bot: { newBot: true, requestStepsPath: CreateBotStepPath } })
      await middleware(req, res, next)
    } catch (error) {
      expect(false).toBeTruthy() // It has thrown an error, not what we expected
    }

    expect(next).toBeCalled()
    expect(next).not.toHaveBeenCalledWith(expect.any(Error))
  })

  theoretically('2. Should throw an error if any validation fails', invalidScenarioTheory, async (error) => {
    const currentBots = faker.datatype.number({ min: 2, max: 10 })
    const allowedBotSteps = faker.datatype.number({ min: 2, max: 10 })

    const userId = await SetupInvalidScenario(error, currentBots, allowedBotSteps)

    const { steps } = CreateBot(userId, allowedBotSteps)

    const req = getMockReq({ user: { id: userId }, body: { steps } }) as unknown as IAuthenticatedRequest

    // Act
    const middleware = ValidateUserPlan({ bot: { newBot: true, requestStepsPath: CreateBotStepPath } })
    await middleware(req, res, next)
    ValidateErroScenario(error)
  })

  async function SetupInvalidScenario(
    error : PossibleErrors,
    currentBots : number,
    allowedBotSteps : number,
  ) : Promise<number> {
    if (error === PossibleErrors.InvalidRequest) {
      return null
    }

    if (error === PossibleErrors.InvalidUser) {
      const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())

      const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

      return user.id + faker.datatype.number()
    }

    if (error === PossibleErrors.UserWithoutPlan) {
      const { user } = await dbSetup.BasicUserSetup({ user: { planId: null } })

      return user.id
    }

    const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())

    const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

    if (error === PossibleErrors.BotLimitReached) {
      await RegisterCurrentBots(currentBots + 1, allowedBotSteps, user.id)
      await RegisterPlanFeatures(plan.id, currentBots, allowedBotSteps)
    }

    if (error === PossibleErrors.StepLimitReached) {
      await RegisterCurrentBots(currentBots, allowedBotSteps - 1, user.id)
      await RegisterPlanFeatures(plan.id, currentBots, allowedBotSteps - 1)
    }

    return user.id
  }

  async function SetupValidScenario(currentBots : number, allowedBotSteps : number) : Promise<number> {
    const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())

    const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

    await RegisterCurrentBots(currentBots, allowedBotSteps, user.id)

    await RegisterPlanFeatures(plan.id, currentBots, allowedBotSteps)

    return user.id
  }

  async function RegisterCurrentBots(currentBots: number, allowedBotSteps: number, userId: number) {
    for (let i = 1; i <= currentBots; i += 1) {
      const steps : Step[] = []

      for (let j = 1; j <= allowedBotSteps; j += 1) {
        steps.push(StepMock.GetRandomSimpleStep())
      }

      const bot = BotMock.GetRandom({ userId, steps, isActive: true })

      await dbSetup.botSetup.Create(bot)
    }
  }

  async function RegisterPlanFeatures(planId: number, currentBots: number, allowedBotSteps: number) {
    const numberOfBotsFeature = await dbSetup.featureSetup.InsertOneFeature(
      { name: FeatureNames.NumberOfBots, type: FeatureTypes.MaxLimit },
    )
    const maxStepsFeature = await dbSetup.featureSetup.InsertOneFeature(
      { name: FeatureNames.NumberOfSteps, type: FeatureTypes.MaxLimit },
    )

    await dbSetup.plansFeaturesSetup.Create(
      { featureId: numberOfBotsFeature.id, planId, maxLimit: currentBots + 1 },
    )

    await dbSetup.plansFeaturesSetup.Create(
      { featureId: maxStepsFeature.id, planId, maxLimit: allowedBotSteps },
    )
  }

  function CreateBot(userId: number, allowedBotSteps: number) : Partial<Bot> {
    const steps : Step[] = []

    for (let j = 1; j <= allowedBotSteps; j += 1) {
      steps.push(StepMock.GetRandomSimpleStep())
    }

    const bot = BotMock.GetRandom({ steps, userId })

    return bot
  }

  function ValidateErroScenario(error: PossibleErrors) {
    switch (error) {
      case PossibleErrors.InvalidRequest:
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        expect(next).toBeCalledWith(expect.objectContaining({ statusCode: StatusCode.NOT_FOUND }))
        break
      case PossibleErrors.InvalidUser:
        expect(next).toHaveBeenCalledWith(expect.any(InexistentUserError))
        expect(next).toBeCalledWith(expect.objectContaining({ statusCode: StatusCode.NOT_FOUND }))
        break
      case PossibleErrors.UserWithoutPlan:
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        expect(next).toBeCalledWith(expect.objectContaining({ statusCode: StatusCode.FORBIDDEN }))
        break
      case PossibleErrors.BotLimitReached:
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        expect(next).toBeCalledWith(expect.objectContaining({ statusCode: StatusCode.FORBIDDEN }))
        break
      case PossibleErrors.StepLimitReached:
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        expect(next).toBeCalledWith(expect.objectContaining({ statusCode: StatusCode.FORBIDDEN }))
        break
      default:
        throw new Error(`invalid possible error ${error}`)
    }
  }
})
