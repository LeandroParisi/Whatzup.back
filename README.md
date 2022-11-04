# Awesome Project Build with TypeORM

Steps to run this project:

1. Install postgress
2. Run npm install
3. Run npm db:create
4. Run npm db:up
5. Run npm run dev
6. Go into localhost:3030/swagger
___

.env that you need:
# Necessary in development and Prod
PORT=<port_to_run>
NODE_ENV=local

# local
DATABASE_URL=<postgress_connection_string_to_local_db>

___


## Architecture

1. Application:
   1. Contexts: Organized WebApi Controllers by application domain / context
      1. Controllers: requests, validations -> Validations stay on this layer
      2. UseCases: DTOs (without validations) and specific logic of a controller if neccesary
2. Commons: Parsers, Mappers, Anotations, Generic Interfaces, etc.
3. Configuration: configs
4. Domain: Entities, enums, etc.
5. Infrastructure: DbConnection, repositories

