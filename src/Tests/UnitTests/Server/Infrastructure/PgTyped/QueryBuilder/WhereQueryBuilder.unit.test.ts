/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker'
import theoretically from 'jest-theories'
import Bot from '../../../../../../Server/Domain/Entities/Bot'
import WhereQueryBuilder from '../../../../../../Server/Infrastructure/PgTyped/QueryBuilders/WhereQueryBuilder'
import BotMock from '../../../../../Shared/Mocks/BotMock'

describe('Where query builder unit tests', () => {
  const theories = [
    { numberOfParameters: 1, numberOfLikes: 1 },
    { numberOfParameters: 3, numberOfLikes: 2 },
    { numberOfParameters: 4, numberOfLikes: 2 },
    { numberOfParameters: 5, numberOfLikes: 3 },
  ]

  theoretically(
    '1. It should return proper string for {numberOfParameters}',
    theories,
    ({ numberOfLikes, numberOfParameters }) => {
      // Arrange
      const bot = BotMock.GetRandom({ id: faker.datatype.number() })
      const botFields = Object.keys(bot).sort(() => Math.random() - 0.5)
      const query : Partial<Bot> = {}
      const likeFields : Array<keyof Bot> = []

      for (let i = 1; i <= numberOfParameters; i += 1) {
        const field = botFields.pop()
        query[field] = bot[field]
      }

      const queryFields = Object.keys(query).sort(() => Math.random() - 0.5)

      for (let i = 0; i < numberOfLikes; i += 1) {
        likeFields.push(queryFields[i] as keyof Bot)
      }

      // Act
      const result = new WhereQueryBuilder().BuildQuery(query, likeFields)

      // Assert
      const r = result.split(' ')
      const likes = r.filter((p) => p === 'LIKE')
      const ands = r.filter((p) => p === 'AND')
      const wheres = r.filter((p) => p === 'WHERE')
      const equalities = r.filter((p) => p === '=')

      expect(likes.length).toBe(numberOfLikes)
      expect(ands.length).toBe(numberOfParameters - 1)
      expect(wheres.length).toBe(1)
      expect(equalities.length).toBe(numberOfParameters - numberOfLikes)
    },
  )
})
