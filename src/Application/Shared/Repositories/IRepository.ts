import { ConnectionPool } from '@databases/pg'

export type IdType = number | string

export interface IBaseRepository<Entity> {
  Create(entity: Partial<Entity>, connection? : ConnectionPool): Promise<Entity>;
  // UpdateOne(query: Entity, entity: Entity, connection? : ConnectionPool): Promise<boolean>;
  // Delete(query: Entity, connection? : ConnectionPool): Promise<void>;
  FindOne(query: Partial<Entity>, connection? : ConnectionPool): Promise<Entity>;
  // FindAll(query: Entity, connection? : ConnectionPool): Promise<Entity[]>;
}
