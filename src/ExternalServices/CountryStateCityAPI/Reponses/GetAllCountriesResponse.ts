export interface CscApiCountry {
  id : number
  name : string
  iso2 : string
}
export type GetAllCountriesResponse = Array<CscApiCountry>
