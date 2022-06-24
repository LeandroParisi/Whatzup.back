import { IncomingHttpHeaders } from 'http'
import IUserToken from '../../../Application/Contexts/Authentication/Interfaces/IUserToken'

declare module 'express' {
  export interface Request {
    headers : IncomingHttpHeaders & {
      auth : string
    }
    user?: IUserToken;
  }
}
