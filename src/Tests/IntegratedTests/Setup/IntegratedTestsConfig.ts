import StaticImplements from '../../../Server/Commons/Anotations/StaticImplements'

@StaticImplements()
export default class IntegratedTestsConfig {
  static TEST_DATABASE_NAME = 'whatzaup_tests'

  static LOCAL_POSTGRESS_URL = 'postgres://leandro_parisi:123deolivera4@localhost:5432'
}
