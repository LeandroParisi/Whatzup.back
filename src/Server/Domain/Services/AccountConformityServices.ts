/* eslint-disable no-underscore-dangle */
import { Service } from 'typedi'
import { default as DateUtils } from '../../../Commons/Utils/DateUtils'
import { StatusCode } from '../../Application/Shared/APIs/Enums/Status'
import { PaymentRepository } from '../../Infrastructure/PgTyped/Repositories/PaymentRepository'
import { PlanRepository } from '../../Infrastructure/PgTyped/Repositories/PlanRepository'
import { UserRepository } from '../../Infrastructure/PgTyped/Repositories/UserRepository'
import { PhoneNumberDTO } from '../DTOs/PhoneNumberDTO'
import Payment from '../Entities/Payment'
import Plan from '../Entities/Plan'
import User from '../Entities/User'
import { DefaultPlans } from '../Enums/DefaultPlans'
import ApiError from '../Errors/ApiError'

export interface UserDependencies {
  phoneNumber? : PhoneNumberDTO
}

@Service()
export class AccountConformityServices {
/**
 *
 */
  constructor(
    private userRepository : UserRepository,
    private planRepository : PlanRepository,
    private paymentRepository : PaymentRepository,
  ) {}

  public async IsUserRegular(user : User) : Promise<boolean> {
    if (!user.isVerified) {
      throw new ApiError(StatusCode.FORBIDDEN, 'User must be verified to use this feature')
    }

    if (!user.isActive) {
      throw new ApiError(StatusCode.FORBIDDEN, 'User account is inactive, check you profile or contact us.')
    }

    const userPlan = await this.planRepository.FindOne({ id: user.planId })

    if (!userPlan) {
      throw new ApiError(StatusCode.FORBIDDEN, 'User must be adherent to a plan to use this feature.')
    }

    if (!userPlan.isCustomPlan && userPlan.name === DefaultPlans.FREE_TIER) {
      return true
    }

    const isUserRegular = await this.CheckUserRegularity(user, userPlan)

    return isUserRegular
  }

  private async CheckUserRegularity(user: User, userPlan: Plan): Promise<boolean> {
    const lastUserPayment = await this.paymentRepository.GetLastUserPayment(user.id)

    const dateNow = DaysUtils.DateNow()

    const isPaymentRegular = this.CheckPaymentRegularity(lastUserPayment, dateNow)
    throw new Error('Method not implemented.')
  }

  private CheckPaymentRegularity(lastUserPayment: Payment, dateNow: Date) {
    const {
      year: yearNow,
      month: monthNow,
      day: dayNow,
    } = DateUtils.ExtractYearMonthDayFromDate(dateNow)

    const {
      year: paymentYear,
      month: paymentMonth,
      day: paymentDay,
    } = DateUtils.ExtractYearMonthDayFromDate(lastUserPayment.dueDate)

    if (paymentYear < yearNow) {

    }
    throw new Error('Method not implemented.')
  }
}
