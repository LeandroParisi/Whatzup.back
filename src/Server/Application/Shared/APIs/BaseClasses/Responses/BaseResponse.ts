export default class BaseResponse<TResponse = void> {
  message : string

  data : TResponse

  /**
   *
   */
  constructor(message: string, data? : TResponse) {
    this.message = message
    this.data = data
  }
}
