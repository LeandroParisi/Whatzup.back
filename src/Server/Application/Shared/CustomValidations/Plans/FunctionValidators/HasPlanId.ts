import { isNumber } from 'class-validator'

function HasPlanId(planId : number) {
  if (isNumber(planId)) {
    return isNumber(planId)
  }

  const shouldBeValidated = !!planId

  return shouldBeValidated
}

export default HasPlanId
