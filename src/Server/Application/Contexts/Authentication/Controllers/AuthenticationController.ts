// import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';

// @JsonController()
// export class AuthenticationController {

//   public async Login(@Body() loginReq : ILoginPayload) : Promise<string> {
//     const { email, password } = loginReq
//     // const user = await this.UserCrud.FindOne({ email })

//     if (!user) throw new ApiError(StatusCode.UNAUTHORIZED, ErrorMessages.Unauthorized)
//     console.log({ user })

//     try {
//       await PasswordHashing.VerifyPassword(password, user.password)
//     } catch (error) {
//       throw new ApiError(StatusCode.UNAUTHORIZED, ErrorMessages.Unauthorized)
//     }

//     const token = JwtConfig.GenerateToken({ email, id: user.id, role: user.role }, JwtConfig.LongerConfig)

//     return token
//   }
// }
