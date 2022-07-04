import CreateBotRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/BotController/Requests/CreateBot/CreateBotRequest'
import UpdateBotRequest from '../../../../../../../../Server/Application/Contexts/AccountManagement/Controllers/BotController/Requests/UpdateBot/UpdateBotRequestBody'
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

  public static GetInvalidCreatePayload() : Array<Partial<CreateBotRequest>> {
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
            type: StepTypes.Simple,
          },
        ],
      },
      {
        ...validPayload,
        steps: [
          {
            id: 1,
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
            id: 1,
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
            id: 1,
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
            id: 1,
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
            id: 1,
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
                nextStepId: 0,
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

  public static GetInvalidUpdatePayload(): Array<Partial<UpdateBotRequest>> {
    const validPayload = this.GetValidPayload()
    const { steps } = validPayload
    const [simpleStep, optionsStep] = steps
    const { options: [optionOne] } = optionsStep

    return [
      {
        ...validPayload,
        botName: '',
      },
      {
        steps: [
          {
            id: null,
            introMessage: simpleStep.introMessage,
            name: simpleStep.name,
            type: StepTypes.Simple,
          },
        ],
      },
      {
        ...validPayload,
        steps: [
          {
            id: 1,
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
            id: 1,
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
            id: 1,
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
            id: 1,
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
            id: 1,
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
                nextStepId: 0,
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
