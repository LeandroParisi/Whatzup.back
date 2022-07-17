/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
import { faker } from '@faker-js/faker'
import { getMockReq, getMockRes } from '@jest-mock/express'
import theoretically from 'jest-theories'
import 'reflect-metadata'
import { UpdateUserPlanIdPath } from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/UserController/Requests/UpdateUserRequest'
import ValidateNewUserPlan from '../../../../../../../../Server/Application/Contexts/AccountManagement/Middlewares/Plans/ValidateNewUserPlan'
import { StatusCode } from '../../../../../../../../Server/Application/Shared/APIs/Enums/Status'
import IAuthenticatedRequest from '../../../../../../../../Server/Application/Shared/APIs/Interfaces/ExpressInterfaces/CustomRequests/IAuthenticatedRequest'
import ApiError from '../../../../../../../../Server/Application/Shared/Errors/ApiError'
import { InexistentUserError } from '../../../../../../../../Server/Application/Shared/Errors/SpecificErrors/InexistentUserError'
import Plan from '../../../../../../../../Server/Domain/Entities/Plan'
import { Step } from '../../../../../../../../Server/Domain/Entities/Steps/Step'
import { FeatureNames } from '../../../../../../../../Server/Domain/Enums/FeatureNames'
import { FeatureTypes } from '../../../../../../../../Server/Domain/Enums/FeatureTypes'
import BotMock from '../../../../../../../Shared/Mocks/BotMock'
import PlanMock from '../../../../../../../Shared/Mocks/PlanMock'
import StepMock from '../../../../../../../Shared/Mocks/StepMock'
import DbSetup from '../../../../../../Setup/Fixtures/DbSetup/DbSetup'

interface SetupReturn {
  userId : number
  newPlanId : number
}

describe('Validate new user plan middleware integrated test', () => {
  let dbSetup : DbSetup
  let validateUserPlan : ValidateNewUserPlan

  const { res, next, mockClear } = getMockRes()

  enum PossibleErrors {
    InvalidRequest,
    InvalidUser,
    BotLimitReached,
    StepLimitReached,
    PhonesByBotLimitReached
  }

  const invalidScenarioTheory = [
    PossibleErrors.InvalidRequest,
    PossibleErrors.InvalidUser,
    PossibleErrors.BotLimitReached,
    PossibleErrors.StepLimitReached,
    PossibleErrors.PhonesByBotLimitReached,
  ]

  beforeEach(() => {
    dbSetup = new DbSetup()
    validateUserPlan = new ValidateNewUserPlan()
  })

  afterEach(async () => {
    await dbSetup.CleanUp()
    mockClear()
  })

  it('1. Should properlly validate user plan if it is valid', async () => {
    // Arrange
    const currentBots = faker.datatype.number({ min: 1, max: 10 })
    const allowedBotSteps = faker.datatype.number({ min: 1, max: 10 })
    const allowedPhonesByBot = faker.datatype.number({ min: 1, max: 10 })
    const { userId, newPlanId } = await SetupValidScenario(currentBots, allowedBotSteps, allowedPhonesByBot)

    const req = getMockReq({ user: { id: userId }, body: { planId: newPlanId } }) as unknown as IAuthenticatedRequest

    // Act
    try {
      const middleware = validateUserPlan.BuildValidator({ requestPlanIdPath: UpdateUserPlanIdPath, maySkipValidation: false })
      await middleware(req, res, next)
    } catch (error) {
      expect(false).toBeTruthy() // It has thrown an error, not what we expected
    }

    expect(next).toBeCalled()
    expect(next).not.toHaveBeenCalledWith(expect.any(Error))
  })

  theoretically('2. Should throw an error if any validation fails {error}', invalidScenarioTheory, async (error) => {
    const currentBots = faker.datatype.number({ min: 2, max: 10 })
    const allowedBotSteps = faker.datatype.number({ min: 2, max: 10 })
    const allowedPhonesByBot = faker.datatype.number({ min: 2, max: 10 })

    const { userId, newPlanId } = await SetupInvalidScenario(error, currentBots, allowedBotSteps, allowedPhonesByBot)

    const req = getMockReq({ user: { id: userId }, body: { planId: newPlanId } }) as unknown as IAuthenticatedRequest

    // Act
    const middleware = validateUserPlan.BuildValidator({ requestPlanIdPath: UpdateUserPlanIdPath, maySkipValidation: false })
    await middleware(req, res, next)
    ValidateErroScenario(error)
  })

  it('3. Should ignore validation if planId is not presented on request body', async () => {
    const { user } = await dbSetup.BasicUserSetup()

    const req = getMockReq({ user: { id: user.id } }) as unknown as IAuthenticatedRequest

    // Act
    const middleware = validateUserPlan.BuildValidator({ requestPlanIdPath: UpdateUserPlanIdPath, maySkipValidation: true })
    await middleware(req, res, next)

    expect(next).toBeCalled()
    expect(next).not.toHaveBeenCalledWith(expect.any(Error))
  })

  async function SetupInvalidScenario(
    error : PossibleErrors,
    currentBots : number,
    allowedBotSteps : number,
    allowedPhonesByBot : number,
  ) : Promise<SetupReturn> {
    if (error === PossibleErrors.InvalidRequest) {
      return { userId: null, newPlanId: null }
    }

    if (error === PossibleErrors.InvalidUser) {
      const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())

      const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

      return { userId: user.id + faker.datatype.number(), newPlanId: faker.datatype.number() }
    }

    const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())

    const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

    const newUserPlan = await CreateNewUserPlan(currentBots, allowedBotSteps, allowedPhonesByBot)

    if (error === PossibleErrors.BotLimitReached) {
      await RegisterCurrentBots(currentBots + 1, allowedBotSteps, allowedPhonesByBot, user.id)
    }

    if (error === PossibleErrors.StepLimitReached) {
      await RegisterCurrentBots(currentBots, allowedBotSteps + 1, allowedPhonesByBot, user.id)
    }

    if (error === PossibleErrors.PhonesByBotLimitReached) {
      await RegisterCurrentBots(currentBots, allowedBotSteps, allowedPhonesByBot + 1, user.id)
    }

    return { userId: user.id, newPlanId: newUserPlan.id }
  }

  async function SetupValidScenario(
    currentBots : number, allowedBotSteps : number, allowedPhonesByBot : number,
  ) : Promise<SetupReturn> {
    const plan = await dbSetup.planSetup.Create(PlanMock.GetRandom())

    const { user } = await dbSetup.BasicUserSetup({ user: { planId: plan.id } })

    await RegisterCurrentBots(currentBots, allowedBotSteps, allowedPhonesByBot, user.id)

    const { id } = await CreateNewUserPlan(currentBots, allowedBotSteps, allowedPhonesByBot)

    return { userId: user.id, newPlanId: id }
  }

  async function CreateNewUserPlan(
    currentBots: number, allowedBotSteps: number, allowedPhonesByBot: number,
  ) : Promise<Plan> {
    const { plan } = await dbSetup.FullPlanSetup({
      plan: PlanMock.GetRandom(),
      features: [
        {
          type: FeatureTypes.MaxLimit,
          name: FeatureNames.NumberOfBots,
          maxLimit: currentBots,
        },
        {
          type: FeatureTypes.MaxLimit,
          name: FeatureNames.NumberOfSteps,
          maxLimit: allowedBotSteps,
        },
        {
          type: FeatureTypes.MaxLimit,
          name: FeatureNames.PhonesPerBot,
          maxLimit: allowedPhonesByBot,
        },
      ],
    })

    return plan
  }

  async function RegisterCurrentBots(
    currentBots: number,
    allowedBotSteps: number,
    allowedPhonesByBot : number,
    userId: number,
  ) {
    for (let i = 1; i <= currentBots; i += 1) {
      const steps : Step[] = []

      for (let j = 1; j <= allowedBotSteps; j += 1) {
        steps.push(StepMock.GetRandomSimpleStep())
      }

      let bot = BotMock.GetRandom({ userId, steps, isActive: true })

      bot = await dbSetup.botSetup.Create(bot)

      for (let j = 1; j <= allowedPhonesByBot; j += 1) {
        const phoneNumber = await dbSetup.phoneNumberSetup.InsertOne()
        await dbSetup.botsPhoneNumbersSetup.Create({ botId: bot.id, phoneNumberId: phoneNumber.id })
      }
    }
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
      case PossibleErrors.BotLimitReached:
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        expect(next).toBeCalledWith(expect.objectContaining({ statusCode: StatusCode.FORBIDDEN }))
        break
      case PossibleErrors.StepLimitReached:
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        expect(next).toBeCalledWith(expect.objectContaining({ statusCode: StatusCode.FORBIDDEN }))
        break
      case PossibleErrors.PhonesByBotLimitReached:
        expect(next).toHaveBeenCalledWith(expect.any(ApiError))
        expect(next).toBeCalledWith(expect.objectContaining({ statusCode: StatusCode.FORBIDDEN }))
        break
      default:
        throw new Error(`invalid possible error ${error}`)
    }
  }
})
