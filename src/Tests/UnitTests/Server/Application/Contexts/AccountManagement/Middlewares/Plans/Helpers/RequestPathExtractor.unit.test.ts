import { getMockReq } from '@jest-mock/express'
import theoretically from 'jest-theories'
import RequestPathExtractor from '../../../../../../../../../Server/Application/Contexts/AccountManagement/Middlewares/Plans/Helpers/RequestPathExtractor'
import ParsingError from '../../../../../../../../../Server/Application/Shared/Errors/SpecificErrors/ParsingError'

describe('Request path extract unit tests', () => {
  const errorTheories = [
    'body.prop.prop2',
    'body..prop.prop2',
    'nothing',
    'nothing.prop..',
  ]

  it('1. Should properlly extract path if a valid path is passed', () => {
    const request = getMockReq({ body: { prop: 123 } })
    const path = 'body.prop'

    const info = RequestPathExtractor.GetInfoFromPath<number>(request, path)

    expect(info).toBe(123)
  })

  theoretically('2. Should throw an error if path is longer than request info', errorTheories, (path) => {
    const request = getMockReq({ body: { prop: 123 } })

    try {
      const info = RequestPathExtractor.GetInfoFromPath<number>(request, path)
      console.log(info)
    } catch (error) {
      expect(error).toBeInstanceOf(ParsingError)
    }
  })
})
