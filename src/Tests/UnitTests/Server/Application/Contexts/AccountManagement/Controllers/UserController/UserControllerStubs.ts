import IDictionary from '../../../../../../../../Server/Commons/Interfaces/SystemInterfaces/IDictionary'

export default class UserControllerStubs {
  static GetSucessTheory() : Array<IDictionary<boolean>> {
    return [
      { countryExists: true, stateExists: true, cityExists: true },
      { countryExists: false, stateExists: true, cityExists: true },
      { countryExists: true, stateExists: false, cityExists: true },
      { countryExists: true, stateExists: true, cityExists: false },
      { countryExists: false, stateExists: false, cityExists: true },
      { countryExists: false, stateExists: true, cityExists: false },
      { countryExists: false, stateExists: false, cityExists: false },
    ]
  }
}
