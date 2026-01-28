import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }]
  },
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).ts'],
  clearMocks: true,
  maxWorkers: 1,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
}

export default config