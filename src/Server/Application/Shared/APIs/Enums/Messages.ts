/* eslint-disable no-shadow */
/* eslint-disable max-len */
export enum ErrorMessages {
  InternalError = 'We had an internal error, please try again later.',
  NotFound = 'We could not find requested information, please check request parameters.',
  ValidationErrors = 'Some validation errors ocurred during your request',
  ExpiredSession = 'Your session has expired, please login again.',
  Unauthorized = 'Invalid password or email.'

}

// Written in PT because it will be the message to be displayed to the user on the front end
export enum ValidationErrors {

}

export enum ResponseMessages {
  CreatedSuccessfully = 'Successfully created resource.'
}
