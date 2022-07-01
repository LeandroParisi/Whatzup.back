import CreateBotRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/BotController/Requests/CreateBot/CreateBotRequest'
import StepTypes from '../../../../../../../../Server/Domain/Entities/Steps/Enums/StepTypes'
import BotMock from '../../../../../../../Shared/Mocks/BotMock'

export default class BotControllerStubs {
  public static GetValidPayload() : CreateBotRequest {
    const bot = BotMock.GetRandom()

    const payload = new CreateBotRequest()
    payload.botName = bot.botName
    payload.steps = bot.steps

    return payload
  }

  public static GetInvalidPayloadTheory() : Array<Partial<CreateBotRequest>> {
    const validPayload = this.GetValidPayload()
    const { steps } = validPayload
    const [simpleStep, optionsStep] = steps
    const { options: [optionOne] } = optionsStep

    return [
      {
        ...validPayload,
        botName: null,
      },
      {
        ...validPayload,
        steps: [
          {
            id: null,
            introMessage: simpleStep.introMessage,
            name: simpleStep.name,
            type: StepTypes.Options,
            options: [],
          },
        ],
      },
      {
        ...validPayload,
        steps: [
          simpleStep,
          {
            id: null,
            introMessage: simpleStep.introMessage,
            name: simpleStep.name,
            type: StepTypes.Simple,
            options: optionsStep.options,
          },
        ],
      },
      {
        ...validPayload,
        steps: [
          {
            id: null,
            introMessage: null,
            name: simpleStep.name,
            type: simpleStep.type,
          },
          optionsStep,
        ],
      },
      {
        ...validPayload,
        steps: [
          {
            id: null,
            introMessage: simpleStep.introMessage,
            name: null,
            type: simpleStep.type,
          },
          optionsStep,
        ],
      },
      {
        ...validPayload,
        steps: [
          {
            id: null,
            introMessage: simpleStep.introMessage,
            name: simpleStep.name,
            type: null,
          },
          optionsStep,
        ],
      },
      {
        ...validPayload,

        steps: [
          simpleStep,
          {
            ...optionsStep,
            options: [
              ...optionsStep.options,
              {
                ...optionOne,
                nextStep: null,
              },
            ],
          },
        ],
      },
      {
        ...validPayload,
        steps: [
          simpleStep,
          {
            ...optionsStep,
            options: [
              ...optionsStep.options,
              {
                ...optionOne,
                nextStep: 0,
              },
            ],
          },
        ],
      },
      {
        ...validPayload,
        steps: [
          simpleStep,
          {
            ...optionsStep,
            options: [
              ...optionsStep.options,
              {
                ...optionOne,
                outboundMessages: null,
              },
            ],
          },
        ],
      },
      {
        ...validPayload,
        steps: [
          simpleStep,
          {
            ...optionsStep,
            options: [
              ...optionsStep.options,
              {
                ...optionOne,
                selectionKey: null,
              },
            ],
          },
        ],
      },
      {
        ...validPayload,
        steps: [
          simpleStep,
          {
            ...optionsStep,
            options: [
              ...optionsStep.options,
              {
                ...optionOne,
                name: null,
              },
            ],
          },
        ],
      },
    ]
  }
}
