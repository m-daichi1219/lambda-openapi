import 'reflect-metadata';
import {
  ApiParam,
  hasApiParam,
  getApiParams,
  getApiParam,
  resetParamOrder,
} from '../../../src/decorators/api-param';
import { MetadataManager } from '../../../src/utils/metadata';

describe('@ApiParam', () => {
  // Test targets
  let testFunction: any;

  beforeEach(() => {
    // Create fresh test target
    testFunction = function testHandler() {};
    // Reset order counter for consistent testing
    resetParamOrder();
  });

  afterEach(() => {
    // Clean up metadata
    MetadataManager.clearMetadata(testFunction);
  });

  describe('Single Parameter', () => {
    it('should apply parameter metadata to a function', () => {
      // Arrange
      const options = {
        name: 'userId',
        description: 'User ID parameter',
        required: true,
        type: 'string',
        example: 'user123',
        enum: ['user123', 'user456'],
        deprecated: false,
      };

      // Act
      const decoratedFunction = ApiParam(options)(testFunction);
      const params = getApiParams(testFunction);
      const param = getApiParam(testFunction, 'userId');

      // Assert
      expect(decoratedFunction).toBe(testFunction);
      expect(params).toHaveLength(1);
      expect(param).toBeDefined();
      expect(param!.name).toBe(options.name);
      expect(param!.description).toBe(options.description);
      expect(param!.required).toBe(options.required);
      expect(param!.type).toBe(options.type);
      expect(param!.example).toBe(options.example);
      expect(param!.enum).toEqual(options.enum);
      expect(param!.deprecated).toBe(options.deprecated);
      expect(param!.in).toBe('path');
      expect(param!.order).toBe(0);
    });

    it('should handle minimal options', () => {
      // Arrange
      const options = {
        name: 'id',
        description: 'Simple ID',
      };

      // Act
      ApiParam(options)(testFunction);
      const params = getApiParams(testFunction);
      const param = getApiParam(testFunction, 'id');

      // Assert
      expect(params).toHaveLength(1);
      expect(param).toBeDefined();
      expect(param!.name).toBe('id');
      expect(param!.description).toBe('Simple ID');
      expect(param!.required).toBe(true); // Default value
      expect(param!.type).toBeUndefined();
      expect(param!.example).toBeUndefined();
      expect(param!.enum).toBeUndefined();
      expect(param!.deprecated).toBeUndefined();
      expect(param!.in).toBe('path');
    });

    it('should handle required flag explicitly set to false', () => {
      // Arrange
      const options = {
        name: 'optionalParam',
        description: 'Optional parameter',
        required: false,
      };

      // Act
      ApiParam(options)(testFunction);
      const param = getApiParam(testFunction, 'optionalParam');

      // Assert
      expect(param).toBeDefined();
      expect(param!.required).toBe(false);
    });

    it('should handle enum values', () => {
      // Arrange
      const options = {
        name: 'status',
        description: 'Status parameter',
        enum: ['active', 'inactive', 'pending'],
        type: 'string',
      };

      // Act
      ApiParam(options)(testFunction);
      const param = getApiParam(testFunction, 'status');

      // Assert
      expect(param).toBeDefined();
      expect(param!.enum).toEqual(['active', 'inactive', 'pending']);
      expect(param!.type).toBe('string');
    });
  });

  describe('Multiple Parameters', () => {
    it('should handle multiple parameters on the same function', () => {
      // Arrange
      const param1 = {
        name: 'userId',
        description: 'User ID',
        type: 'string',
      };
      const param2 = {
        name: 'groupId',
        description: 'Group ID',
        type: 'string',
      };
      const param3 = {
        name: 'itemId',
        description: 'Item ID',
        type: 'number',
      };

      // Act
      ApiParam(param1)(testFunction);
      ApiParam(param2)(testFunction);
      ApiParam(param3)(testFunction);
      const params = getApiParams(testFunction);

      // Assert
      expect(params).toHaveLength(3);
      expect(params[0].name).toBe('userId'); // First applied
      expect(params[1].name).toBe('groupId'); // Second applied
      expect(params[2].name).toBe('itemId'); // Third applied
      expect(params[0].order).toBe(0);
      expect(params[1].order).toBe(1);
      expect(params[2].order).toBe(2);
    });

    it('should maintain order when parameters are applied in different order', () => {
      // Arrange
      const paramZ = {
        name: 'zParam',
        description: 'Z parameter',
      };
      const paramA = {
        name: 'aParam',
        description: 'A parameter',
      };
      const paramM = {
        name: 'mParam',
        description: 'M parameter',
      };

      // Act - Apply in alphabetical order but expect application order
      ApiParam(paramZ)(testFunction);
      ApiParam(paramA)(testFunction);
      ApiParam(paramM)(testFunction);
      const params = getApiParams(testFunction);

      // Assert - Should maintain application order
      expect(params).toHaveLength(3);
      expect(params[0].name).toBe('zParam'); // First applied
      expect(params[1].name).toBe('aParam'); // Second applied
      expect(params[2].name).toBe('mParam'); // Third applied
    });

    it('should handle duplicate parameter names', () => {
      // Arrange
      const param1 = {
        name: 'id',
        description: 'First ID parameter',
        type: 'string',
      };
      const param2 = {
        name: 'id',
        description: 'Second ID parameter',
        type: 'number',
      };

      // Act
      ApiParam(param1)(testFunction);
      ApiParam(param2)(testFunction);
      const params = getApiParams(testFunction);
      const param = getApiParam(testFunction, 'id');

      // Assert
      expect(params).toHaveLength(2);
      expect(param).toBeDefined();
      // getApiParam returns the first matching parameter
      expect(param!.description).toBe('First ID parameter');
      expect(param!.type).toBe('string');
    });
  });

  describe('Method Decorator', () => {
    it('should apply parameter metadata to a class method', () => {
      // Arrange
      const options = {
        name: 'methodParam',
        description: 'Method parameter',
        type: 'string',
        required: true,
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
      ApiParam(options)(TestClass.prototype, 'testMethod', descriptor);

      // Act
      const instance = new TestClass();
      const params = getApiParams(instance.testMethod);
      const param = getApiParam(instance.testMethod, 'methodParam');

      // Assert
      expect(params).toHaveLength(1);
      expect(param).toBeDefined();
      expect(param!.name).toBe('methodParam');
      expect(param!.description).toBe('Method parameter');
      expect(param!.type).toBe('string');
      expect(param!.required).toBe(true);
    });

    it('should preserve method descriptor', () => {
      // Arrange
      const options = {
        name: 'testParam',
        description: 'Test parameter',
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
      const result = ApiParam(options)(
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
      expect(hasApiParam(instance.testMethod)).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    it('should check if function has ApiParam metadata', () => {
      // Arrange
      const options = {
        name: 'testParam',
        description: 'Test parameter',
      };

      // Act & Assert - no metadata initially
      expect(hasApiParam(testFunction)).toBe(false);

      // Apply decorator
      ApiParam(options)(testFunction);

      // Assert - has metadata now
      expect(hasApiParam(testFunction)).toBe(true);
    });

    it('should get all ApiParam metadata from function', () => {
      // Arrange
      const param1 = {
        name: 'param1',
        description: 'First parameter',
        type: 'string',
      };
      const param2 = {
        name: 'param2',
        description: 'Second parameter',
        type: 'number',
      };

      // Act
      ApiParam(param1)(testFunction);
      ApiParam(param2)(testFunction);
      const params = getApiParams(testFunction);

      // Assert
      expect(params).toHaveLength(2);
      expect(params[0].name).toBe('param1');
      expect(params[0].description).toBe('First parameter');
      expect(params[0].type).toBe('string');
      expect(params[1].name).toBe('param2');
      expect(params[1].description).toBe('Second parameter');
      expect(params[1].type).toBe('number');
    });

    it('should return empty array for functions without parameter metadata', () => {
      // Act
      const params = getApiParams(testFunction);

      // Assert
      expect(params).toEqual([]);
    });

    it('should return undefined for non-existent parameter names', () => {
      // Arrange
      const options = {
        name: 'existingParam',
        description: 'Existing parameter',
      };

      // Act
      ApiParam(options)(testFunction);
      const param = getApiParam(testFunction, 'nonExistentParam');

      // Assert
      expect(param).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle various parameter types', () => {
      // Arrange
      const types = [
        'string',
        'number',
        'boolean',
        'integer',
        'array',
        'object',
      ];

      // Act
      types.forEach((type, index) => {
        ApiParam({
          name: `param${index}`,
          description: `Parameter of type ${type}`,
          type,
        })(testFunction);
      });

      const params = getApiParams(testFunction);

      // Assert
      expect(params).toHaveLength(types.length);
      types.forEach((type, index) => {
        const param = getApiParam(testFunction, `param${index}`);
        expect(param).toBeDefined();
        expect(param!.type).toBe(type);
        expect(param!.description).toBe(`Parameter of type ${type}`);
      });
    });

    it('should handle special characters in names and descriptions', () => {
      // Arrange
      const options = {
        name: 'user-id_123',
        description: 'Special chars: éñ中文🚀',
        example: 'test-value_123',
      };

      // Act
      ApiParam(options)(testFunction);
      const param = getApiParam(testFunction, 'user-id_123');

      // Assert
      expect(param).toBeDefined();
      expect(param!.name).toBe('user-id_123');
      expect(param!.description).toBe('Special chars: éñ中文🚀');
      expect(param!.example).toBe('test-value_123');
    });

    it('should handle complex enum values', () => {
      // Arrange
      const options = {
        name: 'complexEnum',
        description: 'Complex enum parameter',
        enum: ['value1', 'value-2', 'value_3', 'VALUE4', '123', 'éñ中文'],
      };

      // Act
      ApiParam(options)(testFunction);
      const param = getApiParam(testFunction, 'complexEnum');

      // Assert
      expect(param).toBeDefined();
      expect(param!.enum).toEqual([
        'value1',
        'value-2',
        'value_3',
        'VALUE4',
        '123',
        'éñ中文',
      ]);
    });

    it('should handle numeric and boolean examples', () => {
      // Arrange
      const stringParam = {
        name: 'stringParam',
        example: 'test-string',
      };
      const numberParam = {
        name: 'numberParam',
        example: 42,
      };
      const booleanParam = {
        name: 'booleanParam',
        example: true,
      };

      // Act
      ApiParam(stringParam)(testFunction);
      ApiParam(numberParam)(testFunction);
      ApiParam(booleanParam)(testFunction);

      // Assert
      const stringParamMeta = getApiParam(testFunction, 'stringParam');
      const numberParamMeta = getApiParam(testFunction, 'numberParam');
      const booleanParamMeta = getApiParam(testFunction, 'booleanParam');

      expect(stringParamMeta!.example).toBe('test-string');
      expect(numberParamMeta!.example).toBe(42);
      expect(booleanParamMeta!.example).toBe(true);
    });
  });

  describe('Order Management', () => {
    it('should reset parameter order counter', () => {
      // Arrange
      ApiParam({ name: 'first', description: 'First param' })(testFunction);
      const firstParam = getApiParam(testFunction, 'first');

      // Act
      resetParamOrder();
      const anotherFunction = function anotherHandler() {};
      ApiParam({ name: 'reset', description: 'After reset' })(anotherFunction);
      const resetParam = getApiParam(anotherFunction, 'reset');

      // Assert
      expect(firstParam!.order).toBe(0);
      expect(resetParam!.order).toBe(0); // Should start from 0 again

      // Cleanup
      MetadataManager.clearMetadata(anotherFunction);
    });
  });
});
