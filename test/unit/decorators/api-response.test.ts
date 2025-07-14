import 'reflect-metadata';
import {
  ApiResponse,
  hasApiResponse,
  getApiResponses,
  getApiResponse,
  resetResponseOrder,
} from '../../../src/decorators/api-response';
import { MetadataManager } from '../../../src/utils/metadata';

describe('@ApiResponse', () => {
  // Test targets
  let testFunction: any;

  beforeEach(() => {
    // Create fresh test target
    testFunction = function testHandler() {};
    // Reset order counter for consistent testing
    resetResponseOrder();
  });

  afterEach(() => {
    // Clean up metadata
    MetadataManager.clearMetadata(testFunction);
  });

  describe('Single Response', () => {
    it('should apply response metadata to a function', () => {
      // Arrange
      const options = {
        status: 200,
        description: 'Success response',
        type: 'object',
        example: { id: 1, name: 'test' },
        headers: { 'X-Custom': { description: 'Custom header' } },
      };

      // Act
      const decoratedFunction = ApiResponse(options)(testFunction);
      const responses = getApiResponses(testFunction);
      const response = getApiResponse(testFunction, 200);

      // Assert
      expect(decoratedFunction).toBe(testFunction);
      expect(responses).toHaveLength(1);
      expect(response).toBeDefined();
      expect(response!.status).toBe(options.status);
      expect(response!.description).toBe(options.description);
      expect(response!.type).toBe(options.type);
      expect(response!.example).toEqual(options.example);
      expect(response!.headers).toEqual(options.headers);
      expect(response!.order).toBe(0);
    });

    it('should handle minimal options', () => {
      // Arrange
      const options = {
        status: 404,
        description: 'Not found',
      };

      // Act
      ApiResponse(options)(testFunction);
      const responses = getApiResponses(testFunction);
      const response = getApiResponse(testFunction, 404);

      // Assert
      expect(responses).toHaveLength(1);
      expect(response).toBeDefined();
      expect(response!.status).toBe(404);
      expect(response!.description).toBe('Not found');
      expect(response!.type).toBeUndefined();
      expect(response!.example).toBeUndefined();
      expect(response!.headers).toBeUndefined();
      expect(response!.content).toBeUndefined();
    });

    it('should handle content type definitions', () => {
      // Arrange
      const options = {
        status: 200,
        description: 'Success with content types',
        content: {
          'application/json': {
            schema: { type: 'object' },
            example: { data: 'test' },
          },
          'text/plain': {
            schema: { type: 'string' },
            example: 'Plain text response',
          },
        },
      };

      // Act
      ApiResponse(options)(testFunction);
      const response = getApiResponse(testFunction, 200);

      // Assert
      expect(response).toBeDefined();
      expect(response!.content).toEqual(options.content);
      expect(response!.content!['application/json'].schema).toEqual({
        type: 'object',
      });
      expect(response!.content!['text/plain'].example).toBe(
        'Plain text response'
      );
    });
  });

  describe('Multiple Responses', () => {
    it('should handle multiple responses on the same function', () => {
      // Arrange
      const response200 = {
        status: 200,
        description: 'Success',
        type: 'object',
      };
      const response404 = {
        status: 404,
        description: 'Not found',
      };
      const response500 = {
        status: 500,
        description: 'Server error',
      };

      // Act
      ApiResponse(response200)(testFunction);
      ApiResponse(response404)(testFunction);
      ApiResponse(response500)(testFunction);
      const responses = getApiResponses(testFunction);

      // Assert
      expect(responses).toHaveLength(3);
      expect(responses[0].status).toBe(200); // First applied
      expect(responses[1].status).toBe(404); // Second applied
      expect(responses[2].status).toBe(500); // Third applied
      expect(responses[0].order).toBe(0);
      expect(responses[1].order).toBe(1);
      expect(responses[2].order).toBe(2);
    });

    it('should maintain order when responses are applied in different order', () => {
      // Arrange
      const response500 = {
        status: 500,
        description: 'Server error',
      };
      const response200 = {
        status: 200,
        description: 'Success',
      };
      const response404 = {
        status: 404,
        description: 'Not found',
      };

      // Act - Apply in different order
      ApiResponse(response500)(testFunction);
      ApiResponse(response200)(testFunction);
      ApiResponse(response404)(testFunction);
      const responses = getApiResponses(testFunction);

      // Assert - Should maintain application order
      expect(responses).toHaveLength(3);
      expect(responses[0].status).toBe(500); // First applied
      expect(responses[1].status).toBe(200); // Second applied
      expect(responses[2].status).toBe(404); // Third applied
    });

    it('should handle duplicate status codes', () => {
      // Arrange
      const response200First = {
        status: 200,
        description: 'First success response',
      };
      const response200Second = {
        status: 200,
        description: 'Second success response',
      };

      // Act
      ApiResponse(response200First)(testFunction);
      ApiResponse(response200Second)(testFunction);
      const responses = getApiResponses(testFunction);
      const response = getApiResponse(testFunction, 200);

      // Assert
      expect(responses).toHaveLength(2);
      expect(response).toBeDefined();
      // getApiResponse returns the first matching response
      expect(response!.description).toBe('First success response');
    });
  });

  describe('Method Decorator', () => {
    it('should apply response metadata to a class method', () => {
      // Arrange
      const options = {
        status: 201,
        description: 'Created',
        type: 'object',
      };

      // Create a test class manually
      class TestClass {
        testMethod() {}
      }

      // Apply decorator manually
      const descriptor = Object.getOwnPropertyDescriptor(
        TestClass.prototype,
        'testMethod'
      );
      ApiResponse(options)(TestClass.prototype, 'testMethod', descriptor);

      // Act
      const instance = new TestClass();
      const responses = getApiResponses(instance.testMethod);
      const response = getApiResponse(instance.testMethod, 201);

      // Assert
      expect(responses).toHaveLength(1);
      expect(response).toBeDefined();
      expect(response!.status).toBe(201);
      expect(response!.description).toBe('Created');
      expect(response!.type).toBe('object');
    });

    it('should preserve method descriptor', () => {
      // Arrange
      const options = {
        status: 200,
        description: 'Method response',
      };

      // Create a test class manually
      class TestClass {
        testMethod() {
          return 'test result';
        }
      }

      // Apply decorator manually
      const descriptor = Object.getOwnPropertyDescriptor(
        TestClass.prototype,
        'testMethod'
      );
      const result = ApiResponse(options)(
        TestClass.prototype,
        'testMethod',
        descriptor
      );

      // Act
      const instance = new TestClass();
      const methodResult = instance.testMethod();

      // Assert
      expect(methodResult).toBe('test result');
      expect(result).toBe(descriptor);
      expect(hasApiResponse(instance.testMethod)).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    it('should check if function has ApiResponse metadata', () => {
      // Arrange
      const options = {
        status: 200,
        description: 'Test response',
      };

      // Act & Assert - no metadata initially
      expect(hasApiResponse(testFunction)).toBe(false);

      // Apply decorator
      ApiResponse(options)(testFunction);

      // Assert - has metadata now
      expect(hasApiResponse(testFunction)).toBe(true);
    });

    it('should get all ApiResponse metadata from function', () => {
      // Arrange
      const response1 = {
        status: 200,
        description: 'Success',
        type: 'object',
      };
      const response2 = {
        status: 400,
        description: 'Bad request',
      };

      // Act
      ApiResponse(response1)(testFunction);
      ApiResponse(response2)(testFunction);
      const responses = getApiResponses(testFunction);

      // Assert
      expect(responses).toHaveLength(2);
      expect(responses[0].status).toBe(200);
      expect(responses[0].description).toBe('Success');
      expect(responses[0].type).toBe('object');
      expect(responses[1].status).toBe(400);
      expect(responses[1].description).toBe('Bad request');
    });

    it('should return empty array for functions without response metadata', () => {
      // Act
      const responses = getApiResponses(testFunction);

      // Assert
      expect(responses).toEqual([]);
    });

    it('should return undefined for non-existent status codes', () => {
      // Arrange
      const options = {
        status: 200,
        description: 'Success',
      };

      // Act
      ApiResponse(options)(testFunction);
      const response = getApiResponse(testFunction, 404);

      // Assert
      expect(response).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle various HTTP status codes', () => {
      // Arrange
      const statusCodes = [
        200, 201, 204, 400, 401, 403, 404, 422, 500, 502, 503,
      ];

      // Act
      statusCodes.forEach(status => {
        ApiResponse({
          status,
          description: `Status ${status}`,
        })(testFunction);
      });

      const responses = getApiResponses(testFunction);

      // Assert
      expect(responses).toHaveLength(statusCodes.length);
      statusCodes.forEach((status, index) => {
        const response = getApiResponse(testFunction, status);
        expect(response).toBeDefined();
        expect(response!.status).toBe(status);
        expect(response!.description).toBe(`Status ${status}`);
      });
    });

    it('should handle special characters in descriptions', () => {
      // Arrange
      const options = {
        status: 200,
        description: 'Special chars: éñ中文🚀',
        example: { message: 'Unicode test: 🌟 ✨' },
      };

      // Act
      ApiResponse(options)(testFunction);
      const response = getApiResponse(testFunction, 200);

      // Assert
      expect(response).toBeDefined();
      expect(response!.description).toBe('Special chars: éñ中文🚀');
      expect(response!.example).toEqual({ message: 'Unicode test: 🌟 ✨' });
    });

    it('should handle complex nested examples', () => {
      // Arrange
      const options = {
        status: 200,
        description: 'Complex response',
        example: {
          data: [
            { id: 1, name: 'Item 1', tags: ['tag1', 'tag2'] },
            { id: 2, name: 'Item 2', tags: ['tag3'] },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
          },
        },
      };

      // Act
      ApiResponse(options)(testFunction);
      const response = getApiResponse(testFunction, 200);

      // Assert
      expect(response).toBeDefined();
      expect(response!.example).toEqual(options.example);
      expect(response!.example.data).toHaveLength(2);
      expect(response!.example.pagination.total).toBe(2);
    });
  });

  describe('Order Management', () => {
    it('should reset response order counter', () => {
      // Arrange
      ApiResponse({ status: 200, description: 'First' })(testFunction);
      const firstResponse = getApiResponse(testFunction, 200);

      // Act
      resetResponseOrder();
      const anotherFunction = function anotherHandler() {};
      ApiResponse({ status: 200, description: 'After reset' })(anotherFunction);
      const resetResponse = getApiResponse(anotherFunction, 200);

      // Assert
      expect(firstResponse!.order).toBe(0);
      expect(resetResponse!.order).toBe(0); // Should start from 0 again

      // Cleanup
      MetadataManager.clearMetadata(anotherFunction);
    });
  });
});
