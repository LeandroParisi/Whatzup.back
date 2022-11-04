/* eslint-disable no-use-before-define */
import { faker } from '@faker-js/faker'
import { assert } from 'chai'
import { PhoneNumberRepository } from '../../../../../../Server/Infrastructure/PgTyped/Repositories/PhoneNumberRepository'
import DbSetup from '../../../../Setup/Fixtures/DbSetup/DbSetup'

describe('PhoneNumber repository repository integrated tests', () => {
  let dbSetup : DbSetup
  let repository : PhoneNumberRepository

  beforeEach(() => {
    dbSetup = new DbSetup()
    repository = new PhoneNumberRepository()
  })

  afterEach(async () => {
    await dbSetup.CleanUp()
  })

  it('TryInsertBotPhoneNumbers: Should just insert necessary phone numbers', async () => {
    // Arrange
    const alreadyInsertedPhoneNumbers = faker.datatype.number({ min: 1, max: 10 })
    const newPhoneNumbers = faker.datatype.number({ min: 1, max: 10 })
    const {
      bot,
      alreadyInsertedNumbers,
      newNumbers,
    } = await Setup(alreadyInsertedPhoneNumbers, newPhoneNumbers)

    const allNumbers = alreadyInsertedNumbers.concat(newNumbers)

    // Act
    await repository.TryInsertBotPhoneNumbers(allNumbers, bot.id)

    // Assert
    const postInsertedPhoneNumbers = await dbSetup.phoneNumberSetup.FindAllByBotId(bot.id)
    const newInsertedPhoneNumbers = postInsertedPhoneNumbers
      .filter((p) => !new Set([...alreadyInsertedNumbers.map((x) => x.whatsappNumber)]).has(p.whatsappNumber))

    assert.deepEqual(newInsertedPhoneNumbers, newNumbers)
  })

  async function Setup(alreadyInsertedPhoneNumbers : number, newPhoneNumbers : number) {
    const { bot } = await dbSetup.BasicUserBotSetup()

    const alreadyInsertedNumbers = await dbSetup.phoneNumberSetup
      .CreateXNumbers({ randomNumbersToCreate: alreadyInsertedPhoneNumbers })

    const newNumbers = await dbSetup.phoneNumberSetup
      .CreateXNumbers({ randomNumbersToCreate: newPhoneNumbers })

    await dbSetup.botsPhoneNumbersSetup.CreateXRelations(bot.id, alreadyInsertedNumbers?.map((x) => x.id))

    return {
      bot,
      alreadyInsertedNumbers,
      newNumbers,
    }
  }
})
