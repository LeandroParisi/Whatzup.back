import JwtConfig from '../../../Server/Application/Contexts/Authentication/Hashing/JwtConfig'
import IUserToken from '../../../Server/Application/Contexts/Authentication/Interfaces/IUserToken'

export default class JwtMocks {
  static GetToken(user : IUserToken) {
    return JwtConfig.GenerateToken(user, JwtConfig.BaseConfig)
  }
}
