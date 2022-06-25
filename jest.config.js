module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['ts'],
  roots: ['src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['jest-extended'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  globalSetup: 'src/Tests/Setup/global-setup.ts',
  globalTeardown: 'src/Tests/Setup/global-teardown.ts',
}
