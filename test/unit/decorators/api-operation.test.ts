import 'reflect-metadata';
import {
  ApiOperation,
  hasApiOperation,
  getApiOperation,
} from '../../../src/decorators/api-operation';
import { MetadataManager } from '../../../src/utils/metadata';

describe('@ApiOperation', () => {
  // Test targets
  let testFunction: any;
  let testClass: any;

  beforeEach(() => {
    // Create fresh test targets
    testFunction = function testHandler() {};
    testClass = class TestClass {};
  });

  afterEach(() => {
    // Clean up metadata
    MetadataManager.clearMetadata(testFunction);
    MetadataManager.clearMetadata(testClass);
  });

  describe('Function Decorator', () => {
    it('should apply operation metadata to a function', () => {
      // Arrange
      const options = {
        summary: 'Test operation',
        description: 'Test description',
        tags: ['test'],
        operationId: 'testOp',
        deprecated: false,
      };

      // Act
      const decoratedFunction = ApiOperation(options)(testFunction);
      const metadata = getApiOperation(testFunction);

      // Assert
      expect(decoratedFunction).toBe(testFunction);
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options.summary);
      expect(metadata!.description).toBe(options.description);
      expect(metadata!.tags).toEqual(options.tags);
      expect(metadata!.operationId).toBe(options.operationId);
      expect(metadata!.deprecated).toBe(options.deprecated);
      expect(metadata!.functionName).toBe('testHandler');
    });

    it('should handle anonymous functions', () => {
      // Arrange
      const options = {
        summary: 'Anonymous operation',
      };
      const anonymousFunction = function () {};

      // Act
      ApiOperation(options)(anonymousFunction);
      const metadata = getApiOperation(anonymousFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options.summary);
      // The function name will be 'anonymousFunction' due to variable assignment
      expect(metadata!.functionName).toBe('anonymousFunction');
    });

    it('should handle minimal options', () => {
      // Arrange
      const options = {
        summary: 'Minimal operation',
      };

      // Act
      ApiOperation(options)(testFunction);
      const metadata = getApiOperation(testFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options.summary);
      expect(metadata!.description).toBeUndefined();
      expect(metadata!.tags).toBeUndefined();
      expect(metadata!.operationId).toBeUndefined();
      expect(metadata!.deprecated).toBeUndefined();
    });

    it('should handle empty tags array', () => {
      // Arrange
      const options = {
        summary: 'Operation with empty tags',
        tags: [],
      };

      // Act
      ApiOperation(options)(testFunction);
      const metadata = getApiOperation(testFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.tags).toEqual([]);
    });
  });

  describe('Method Decorator', () => {
    it('should apply operation metadata to a class method', () => {
      // Arrange
      const options = {
        summary: 'Test method',
        description: 'Test method description',
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
      ApiOperation(options)(TestClass.prototype, 'testMethod', descriptor);

      // Act
      const instance = new TestClass();
      const metadata = getApiOperation(instance.testMethod);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options.summary);
      expect(metadata!.description).toBe(options.description);
      expect(metadata!.functionName).toBe('testMethod');
    });

    it('should preserve method descriptor', () => {
      // Arrange
      const options = {
        summary: 'Test method with descriptor',
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
      const result = ApiOperation(options)(
        TestClass.prototype,
        'testMethod',
        descriptor
      );

      // Act
      const instance = new TestClass();
      const methodResult = instance.testMethod();

      // Assert
      expect(methodResult).toBe('test result');
      expect(result).toBe(descriptor); // Descriptor should be preserved
      expect(getApiOperation(instance.testMethod)).toBeDefined();
    });
  });

  describe('Utility Functions', () => {
    it('should check if function has ApiOperation metadata', () => {
      // Arrange
      const options = {
        summary: 'Test operation',
      };

      // Act & Assert - no metadata initially
      expect(hasApiOperation(testFunction)).toBe(false);

      // Apply decorator
      ApiOperation(options)(testFunction);

      // Assert - has metadata now
      expect(hasApiOperation(testFunction)).toBe(true);
    });

    it('should get ApiOperation metadata from function', () => {
      // Arrange
      const options = {
        summary: 'Test operation',
        description: 'Test description',
        tags: ['test'],
      };

      // Act
      ApiOperation(options)(testFunction);
      const metadata = getApiOperation(testFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options.summary);
      expect(metadata!.description).toBe(options.description);
      expect(metadata!.tags).toEqual(options.tags);
    });

    it('should return undefined for functions without metadata', () => {
      // Act
      const metadata = getApiOperation(testFunction);

      // Assert
      expect(metadata).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle function with existing name', () => {
      // Arrange
      const options = {
        summary: 'Named function test',
      };
      const namedFunction = function myCustomHandler() {};

      // Act
      ApiOperation(options)(namedFunction);
      const metadata = getApiOperation(namedFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.functionName).toBe('myCustomHandler');
    });

    it('should handle arrow functions', () => {
      // Arrange
      const options = {
        summary: 'Arrow function test',
      };
      const arrowFunction = () => {};

      // Act
      ApiOperation(options)(arrowFunction);
      const metadata = getApiOperation(arrowFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options.summary);
      // Arrow functions get their variable name
      expect(metadata!.functionName).toBe('arrowFunction');
    });

    it('should handle overwriting existing metadata', () => {
      // Arrange
      const options1 = {
        summary: 'First operation',
      };
      const options2 = {
        summary: 'Second operation',
        description: 'Updated description',
      };

      // Act
      ApiOperation(options1)(testFunction);
      ApiOperation(options2)(testFunction);
      const metadata = getApiOperation(testFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options2.summary);
      expect(metadata!.description).toBe(options2.description);
    });

    it('should handle special characters in summary', () => {
      // Arrange
      const options = {
        summary: 'Special chars: éñ中文🚀',
        description: 'Unicode test: 🌟 ✨',
      };

      // Act
      ApiOperation(options)(testFunction);
      const metadata = getApiOperation(testFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options.summary);
      expect(metadata!.description).toBe(options.description);
    });

    it('should handle truly anonymous functions', () => {
      // Arrange
      const options = {
        summary: 'Truly anonymous test',
      };

      // Create an anonymous function with no name
      const anonymousFunction = (() => {
        return function () {};
      })();

      // Act
      ApiOperation(options)(anonymousFunction);
      const metadata = getApiOperation(anonymousFunction);

      // Assert
      expect(metadata).toBeDefined();
      expect(metadata!.summary).toBe(options.summary);
      expect(metadata!.functionName).toBe('anonymous');
    });
  });
});
