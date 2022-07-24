import { test as base, expect } from '@playwright/test'
import { fixtures } from '@playwright-testing-library/test/fixture'
import type {
  TestingLibraryFixtures
} from '@playwright-testing-library/test/fixture'
import { MockAgent, setGlobalDispatcher } from 'undici'

import { createServer } from 'http'
import type { Server } from 'http'
import { once } from 'events'

import { createApp } from '@remix-run/serve'
import { loadEnv } from '@remix-run/dev/dist/env'
import { build } from '@remix-run/dev/dist/cli/commands'

import { join } from 'path'

import { installGlobals } from "@remix-run/node"

installGlobals()

interface TestFixtures extends TestingLibraryFixtures {
  mockAgent: MockAgent;
}

interface WorkerFixtures {
  port: number;
  server: Server;
}

export { expect }

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Setup queries from playwright-testing-library
  ...fixtures,

  // Assign a unique "port" for each worker process
  port: [
    // eslint-disable-next-line no-empty-pattern
    async ({ }, use, workerInfo) => {
      await use(3001 + workerInfo.workerIndex)
    },
    { scope: 'worker' },
  ],

  server: [
    // eslint-disable-next-line no-empty-pattern
    async ({ port }, use, workerInfo) => {
      const root = process.cwd()

      // Load .env
      await loadEnv(root)

      // Build app code
      await build(root, 'development', true)

      // Create app
      const app = createApp(
        join(root, 'build'),
        'development',
        join(root, 'public')
      )

      // Start the server.
      const server = createServer(app)

      server.listen(port)
      await once(server, 'listening')

      // Use the server in the tests.
      await use(server)

      // Cleanup.
      await new Promise(done => server.close(done))
    },
    { scope: 'worker' }
  ],

  // Ensure visits works with relative path
  baseURL: ({ port, server }, use) => {
    use(`http://localhost:${port}`)
  },

  // Setup mock client for requests initiated by the Worker
  mockAgent:
    // eslint-disable-next-line no-empty-pattern
    async ({ }, use) => {
      const mockAgent = new MockAgent()

      // Optional: This makes all the request fails if no matching mock is found
      // mockAgent.disableNetConnect()

      setGlobalDispatcher(mockAgent)

      await use(mockAgent)
    },
})
