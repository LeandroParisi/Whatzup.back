/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCode } from '../../../Application/Shared/APIs/Enums/Status'
import ApiError from '../../../Application/Shared/Errors/ApiError'
import StaticImplements from '../../Anotations/StaticImplements'

@StaticImplements()
export class CaseSerializer {
  static CastToCamel<Input, Output>(dbModel : Input) : Output {
    return this.KeysToCamel(dbModel) as Output
  }

  static CastArrayToCamel<Input, Output>(dbModel : Input[]) : Output[] {
    return this.KeysToCamel(dbModel) as Output[]
  }

  static CastToSnake<Input, Output>(domainModel : Input) : Output {
    return this.KeysToSnake(domainModel) as Output
  }

  static CastArrayToSnake<Input, Output>(domainModel : Input[]) : Output[] {
    return this.KeysToSnake(domainModel) as Output[]
  }

  private static KeysToCamel(o : any) {
    try {
      if (CaseSerializer.IsDate(o)) {
        return o
      }
      if (CaseSerializer.IsObject(o)) {
        const n = {}

        Object.keys(o)
          .forEach((k) => {
            n[CaseSerializer.ToCamel(k)] = CaseSerializer.KeysToCamel(o[k])
          })

        return n
      } if (CaseSerializer.IsArray(o)) {
        return o.map((i) => CaseSerializer.KeysToCamel(i))
      }
      return o
    } catch (error) {
      throw new ApiError(
        StatusCode.INTERNAL_SERVER_ERROR,
        'Unable to parse db object to Domain object: CaseSerializer.KeysToCamel',
        error,
      )
    }
  }

  private static KeysToSnake(o : any) {
    try {
      if (CaseSerializer.IsDate(o)) {
        return o
      }
      if (CaseSerializer.IsObject(o)) {
        const n = {}

        Object.keys(o)
          .forEach((k) => {
            n[CaseSerializer.ToSnake(k)] = CaseSerializer.KeysToSnake(o[k])
          })

        return n
      } if (CaseSerializer.IsArray(o)) {
        return o.map((i) => CaseSerializer.KeysToSnake(i))
      }
      return o
    } catch (error) {
      throw new ApiError(
        StatusCode.INTERNAL_SERVER_ERROR,
        'Unable to parse db object to Domain object: CaseSerializer.KeysToSnake',
        error,
      )
    }
  }

  private static ToSnake = (s : any) => s.replace(/[A-Z]/g, (letter : string) => `_${letter.toLowerCase()}`);

  private static ToCamel = (s : any) => s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase()
    .replace('-', '')
    .replace('_', ''));

  private static IsArray(t : any) {
    return Array.isArray(t)
  }

  private static IsDate(t : any) {
    return t instanceof Date
  }

  private static IsObject(o : any) {
    return o === Object(o) && !CaseSerializer.IsArray(o) && typeof o !== 'function'
  }
}
