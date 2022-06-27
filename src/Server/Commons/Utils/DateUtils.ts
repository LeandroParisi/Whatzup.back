/* eslint-disable no-shadow */

enum dayTranslation {
  sunday = 'Sunday',
  monday = 'Monday',
  tuesday = 'Tuesday',
  wednesday = 'Wednesday',
  thursday = 'Thursday',
  friday = 'Friday',
  saturday = 'Saturday'
}

export default class DaysUtils {
  static TranslateToPt(day : keyof typeof dayTranslation) : string {
    return dayTranslation[day]
  }

  static DateNow() {
    const timestampDate = new Date(Date.now())

    const minutesInAnHour = 60

    timestampDate
      .setHours(timestampDate.getHours() - timestampDate.getTimezoneOffset() / minutesInAnHour)

    return timestampDate
  }

  static GetDateFromDbString(dbDate : string) : Date {
    return DaysUtils.GetDateFromTimestamp(new Date(dbDate).getTime() / 1000)
  }

  static GetDateFromTimestamp(timestamp : number) : Date {
    const timestampDate = new Date(timestamp * 1000)

    const minutesInAnHour = 60

    timestampDate
      .setHours(timestampDate.getHours() - timestampDate.getTimezoneOffset() / minutesInAnHour)

    return timestampDate
  }

  static GetDayNumberFromTimestamp(timestamp : number) : number {
    const sundayAsFirstDayDifference = 1
    return DaysUtils.GetDateFromTimestamp(timestamp).getDay() + sundayAsFirstDayDifference
  }

  static GetDatesDifferenceInDays(currentDate : Date, previousDate : Date) : number {
    const yearsDifference = Math.abs(currentDate.getFullYear() - previousDate.getFullYear())
    const monthsDifference = Math.abs((currentDate.getMonth() + 1) - (previousDate.getMonth() + 1))
    const daysDifference = Math.abs(currentDate.getDate() - previousDate.getDate())

    return yearsDifference * 360 + monthsDifference * 30 + daysDifference
  }

  static SubtractTimeFromDate(currentDate : Date, hoursToSubtract : number) : Date {
    const numberOfMlSeconds = currentDate.getTime()
    const addMlSeconds = (hoursToSubtract * 60) * 60 * 1000
    const newDateObj = new Date(numberOfMlSeconds - addMlSeconds)

    return newDateObj
  }
}
