export default abstract class BaseResponse {
  message : string

  /**
   *
   */
  constructor(message: string) {
    this.message = message
  }
}
