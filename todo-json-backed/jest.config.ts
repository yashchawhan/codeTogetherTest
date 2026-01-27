import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).ts'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
}

export default config