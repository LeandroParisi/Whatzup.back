/* eslint-disable @typescript-eslint/no-unused-vars */

import { Mapper } from '@automapper/core'

/* eslint-disable @typescript-eslint/no-namespace */
export interface IMapInstaller {
  // add some methods or something to distinguish from {}
  CreateMappings(mapper : Mapper): void;
}

// // add a registry of the type you expect
// export namespace MapInstaller {
//   type Constructor<T> = {
//     new(...args: any[]): T;
//     readonly prototype: T;
//   }

//   const implementations: Constructor<IMapInstaller>[] = []

//   export function GetImplementations(): Constructor<IMapInstaller>[] {
//     return implementations
//   }

//   export function register<T extends Constructor<IMapInstaller>>(ctor: T) {
//     implementations.push(ctor)
//     return ctor
//   }
// }
