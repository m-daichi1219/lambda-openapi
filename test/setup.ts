import 'reflect-metadata';

// Global test configuration
beforeAll(() => {
  // Setup global test environment
});

afterAll(() => {
  // Cleanup after all tests
});

// Mock AWS Lambda types for testing
jest.mock('aws-lambda', () => ({
  APIGatewayProxyEvent: {},
  APIGatewayProxyResult: {},
})); 