import { classes } from '@automapper/classes'
import { createMapper } from '@automapper/core'
import BotControllerMapper from '../../Application/Contexts/AccountManagement/Controllers/BotController/BotControllerMapper'
import UserControllerMapper from '../../Application/Contexts/AccountManagement/Controllers/UserController/UserControllerMapper'

// Create and export the mapper
export const Mapper = createMapper({
  strategyInitializer: classes(),
})

// Installation of mappings
UserControllerMapper.CreateMappings(Mapper)
BotControllerMapper.CreateMappings(Mapper)
