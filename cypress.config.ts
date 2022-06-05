import 'dotenv/config';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,

    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

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
