// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://budget-tracker.com:8100',
    viewportWidth: 1280,
    viewportHeight: 970,
    videoUploadOnPasses: false,
    screenshotOnRunFailure: false,
    retries: 1,
    video: false,
    requestTimeout: 10000,
    defaultCommandTimeout: 10000,
  },
});
