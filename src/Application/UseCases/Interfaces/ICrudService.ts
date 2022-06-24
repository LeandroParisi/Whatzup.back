export interface ICrudService<Entity> {
  Create(model: Entity): Promise<Entity>;
  Update(query: Partial<Entity>, model: Partial<Entity>): Promise<boolean>;
  Delete(query: Partial<Entity>): Promise<void>;
  FindOne(query: Partial<Entity>): Promise<Entity>;
  FindAll(query: Partial<Entity>): Promise<Entity[]>;
}
