import { JwtPayload, sign, verify } from 'jsonwebtoken'
import IUserToken from '../Interfaces/IUserToken'

require('dotenv/config')

export default class JwtConfig {
  static SECRET = process.env.SECRET;

  static BaseConfig = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };

  static LongerConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  static CreateJWTPayload(user : IUserToken) : JwtPayload {
    return {
      iss: 'WhatsappApp',
      aud: 'identity',
      userData: user,
    }
  }

  static GenerateToken(user : IUserToken, jwtConfig : object) : string {
    const payload = JwtConfig.CreateJWTPayload(user)
    const token = sign(payload, JwtConfig.SECRET, jwtConfig)
    return token
  }

  static Decode(token : string) : JwtPayload {
    return verify(token, JwtConfig.SECRET) as JwtPayload
  }
}
