import { Service } from 'typedi'
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity,
} from 'typeorm'

@Entity({
  name: 'user',
})
@Service()
export default class User extends BaseEntity {
  @Column()
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  whatsappNumber: string

  @Column()
  whatsappId: string

  @Column()
  email: string

  @Column()
  documentNumber: string

  @Column()
  firstName: string

  @Column()
  middleName: string

  @Column()
  lastName: string

  @Column()
  countryId: number

  @Column()
  stateId: number

  @Column()
  cityId: number

  @Column()
  neighbourhood: string

  @Column()
  addressStreet: string

  @Column()
  addressNumber: string

  @Column()
  addressComplement: string

  @Column()
  postalCode: string

  @Column()
  wasActivated: boolean

  @Column()
  isActivated: boolean

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date
}
