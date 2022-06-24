import { Repository, Connection, ObjectType } from 'typeorm'

export class BaseRepository<T> extends Repository<T> {
  private connection: Connection;

  private entity: ObjectType<T>;

  constructor(entity: ObjectType<T>, connection: Connection) {
    super(entity, connection.manager)
    this.entity = entity
    this.connection = connection
    Object.assign(this, {
      manager: connection.manager,
      metadata: connection.getMetadata(entity),
      queryRunner: connection.manager.queryRunner,
    })
  }

  test() {
    console.log('repo test', this.entity, this.connection)
  }
}
