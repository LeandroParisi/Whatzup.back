import { Service } from 'typedi'
import { CaseSerializer } from '../../../Commons/Globals/Serializers/CaseSerializer'

@Service()
export default class WhereQueryBuilder {
  public BuildQuery<Entity>(entity : Partial<Entity>, likeFields? : Array<keyof Entity>) : string {
    let query = ''

    Object.entries(entity).forEach(([key, value]) => {
      const k = CaseSerializer.ToSnake(key)
      const v = value as string
      const equality = likeFields ? this.BuildEquality<Entity>(k, v, likeFields) : this.BuildEquality<Entity>(k, v)

      if (!query.length) {
        query += `WHERE ${k} ${equality}`
      } else {
        query += ` AND ${k} ${equality}`
      }
    })

    return query
  }

  private BuildEquality<Entity>(key: string, value : string, likeFields?: Array<keyof Entity>) {
    const likeSet = new Set(likeFields.map((f) => CaseSerializer.ToSnake(f as string)))

    if (likeSet.has(key)) {
      return `LIKE '%${value}%'`
    }
    return `= ${value}`
  }
}
