// https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  //   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work,
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverageFrom: ["src/**/*.+(js|jsx|ts|tsx)"],
  coveragePathIgnorePatterns: ["src/test-utils.tsx", "src/yup.locale.ts", "src/types", "src/assets", "src/i18n.ts"],
  coverageThreshold: {
    global: {
      statements: 14,
      branches: 9,
      functions: 6,
      lines: 15
    }
  }
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
