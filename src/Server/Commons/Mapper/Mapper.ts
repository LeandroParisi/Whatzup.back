import { classes } from '@automapper/classes'
import { createMapper } from '@automapper/core'
import CreateBotMapper from '../../Application/Contexts/AccountManagement/Controllers/BotController/CreateBotMapper'
import CreateUserMapper from '../../Application/Contexts/AccountManagement/Controllers/UserController/Requests/CreateUserMapper'

// Create and export the mapper
export const Mapper = createMapper({
  strategyInitializer: classes(),
})

// Installation of mappings
CreateUserMapper.CreateMappings(Mapper)
CreateBotMapper.CreateMappings(Mapper)
