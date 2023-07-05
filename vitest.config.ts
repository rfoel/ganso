import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    threads: false,
  },
  resolve: {
    alias: {
      application: '/src/application',
      domain: '/src/domain',
      infra: '/src/infra',
      http: '/src/http',
    },
  },
})
