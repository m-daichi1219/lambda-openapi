import 'reflect-metadata';
import { MetadataManager } from '../../../src/utils/metadata';
import { METADATA_KEYS } from '../../../src/types/internal';

describe('MetadataManager', () => {
  let testTarget: any;

  beforeEach(() => {
    // Create a fresh target for each test
    testTarget = function testFunction() {};
  });

  afterEach(() => {
    // Clean up metadata after each test
    MetadataManager.clearMetadata(testTarget);
  });

  describe('Operation Metadata', () => {
    it('should set and get operation metadata', () => {
      // Arrange
      const operationMetadata = {
        functionName: 'testFunction',
        summary: 'Test operation',
        description: 'Test description',
        tags: ['test'],
        operationId: 'testOp',
        deprecated: false,
      };

      // Act
      MetadataManager.setOperation(testTarget, operationMetadata);
      const retrieved = MetadataManager.getOperation(testTarget);

      // Assert
      expect(retrieved).toEqual(operationMetadata);
    });

    it('should return undefined when no operation metadata exists', () => {
      // Act
      const retrieved = MetadataManager.getOperation(testTarget);

      // Assert
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Response Metadata', () => {
    it('should add and get response metadata', () => {
      // Arrange
      const response1 = {
        status: 200,
        description: 'Success',
        order: 1,
      };
      const response2 = {
        status: 404,
        description: 'Not Found',
        order: 0,
      };

      // Act
      MetadataManager.addResponse(testTarget, response1);
      MetadataManager.addResponse(testTarget, response2);
      const retrieved = MetadataManager.getResponses(testTarget);

      // Assert
      expect(retrieved).toHaveLength(2);
      expect(retrieved[0]).toEqual(response2); // Should be first due to order
      expect(retrieved[1]).toEqual(response1);
    });

    it('should return empty array when no responses exist', () => {
      // Act
      const retrieved = MetadataManager.getResponses(testTarget);

      // Assert
      expect(retrieved).toEqual([]);
    });
  });

  describe('Parameter Metadata', () => {
    it('should add and get parameter metadata', () => {
      // Arrange
      const param1 = {
        name: 'id',
        in: 'path' as const,
        required: true,
        type: 'string',
        order: 1,
      };
      const param2 = {
        name: 'userId',
        in: 'path' as const,
        required: true,
        type: 'string',
        order: 0,
      };

      // Act
      MetadataManager.addParam(testTarget, param1);
      MetadataManager.addParam(testTarget, param2);
      const retrieved = MetadataManager.getParams(testTarget);

      // Assert
      expect(retrieved).toHaveLength(2);
      expect(retrieved[0]).toEqual(param2); // Should be first due to order
      expect(retrieved[1]).toEqual(param1);
    });

    it('should return empty array when no parameters exist', () => {
      // Act
      const retrieved = MetadataManager.getParams(testTarget);

      // Assert
      expect(retrieved).toEqual([]);
    });
  });

  describe('Query Metadata', () => {
    it('should add and get query metadata', () => {
      // Arrange
      const query1 = {
        name: 'limit',
        type: 'number',
        required: false,
        order: 1,
      };
      const query2 = {
        name: 'offset',
        type: 'number',
        required: false,
        order: 0,
      };

      // Act
      MetadataManager.addQuery(testTarget, query1);
      MetadataManager.addQuery(testTarget, query2);
      const retrieved = MetadataManager.getQueries(testTarget);

      // Assert
      expect(retrieved).toHaveLength(2);
      expect(retrieved[0]).toEqual(query2); // Should be first due to order
      expect(retrieved[1]).toEqual(query1);
    });

    it('should return empty array when no queries exist', () => {
      // Act
      const retrieved = MetadataManager.getQueries(testTarget);

      // Assert
      expect(retrieved).toEqual([]);
    });
  });

  describe('Body Metadata', () => {
    it('should set and get body metadata', () => {
      // Arrange
      const bodyMetadata = {
        description: 'Request body',
        type: 'object',
        required: true,
        order: 0,
      };

      // Act
      MetadataManager.setBody(testTarget, bodyMetadata);
      const retrieved = MetadataManager.getBody(testTarget);

      // Assert
      expect(retrieved).toEqual(bodyMetadata);
    });

    it('should return undefined when no body metadata exists', () => {
      // Act
      const retrieved = MetadataManager.getBody(testTarget);

      // Assert
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Security Metadata', () => {
    it('should add and get security metadata', () => {
      // Arrange
      const security1 = {
        type: 'apiKey' as const,
        name: 'x-api-key',
        in: 'header' as const,
        order: 1,
      };
      const security2 = {
        type: 'http' as const,
        scheme: 'bearer',
        order: 0,
      };

      // Act
      MetadataManager.addSecurity(testTarget, security1);
      MetadataManager.addSecurity(testTarget, security2);
      const retrieved = MetadataManager.getSecurity(testTarget);

      // Assert
      expect(retrieved).toHaveLength(2);
      expect(retrieved[0]).toEqual(security2); // Should be first due to order
      expect(retrieved[1]).toEqual(security1);
    });

    it('should return empty array when no security metadata exists', () => {
      // Act
      const retrieved = MetadataManager.getSecurity(testTarget);

      // Assert
      expect(retrieved).toEqual([]);
    });
  });

  describe('Tag Metadata', () => {
    it('should add and get tag metadata', () => {
      // Arrange
      const tag1 = {
        name: 'users',
        description: 'User operations',
        order: 1,
      };
      const tag2 = {
        name: 'auth',
        description: 'Authentication',
        order: 0,
      };

      // Act
      MetadataManager.addTag(testTarget, tag1);
      MetadataManager.addTag(testTarget, tag2);
      const retrieved = MetadataManager.getTags(testTarget);

      // Assert
      expect(retrieved).toHaveLength(2);
      expect(retrieved[0]).toEqual(tag2); // Should be first due to order
      expect(retrieved[1]).toEqual(tag1);
    });

    it('should return empty array when no tags exist', () => {
      // Act
      const retrieved = MetadataManager.getTags(testTarget);

      // Assert
      expect(retrieved).toEqual([]);
    });
  });

  describe('Complete Handler Metadata', () => {
    it('should get complete handler metadata', () => {
      // Arrange
      const operation = {
        functionName: 'testFunction',
        summary: 'Test operation',
      };
      const response = {
        status: 200,
        description: 'Success',
        order: 0,
      };
      const param = {
        name: 'id',
        in: 'path' as const,
        required: true,
        order: 0,
      };

      MetadataManager.setOperation(testTarget, operation);
      MetadataManager.addResponse(testTarget, response);
      MetadataManager.addParam(testTarget, param);

      // Act
      const metadata = MetadataManager.getHandlerMetadata(testTarget);

      // Assert
      expect(metadata.operation).toEqual(operation);
      expect(metadata.responses).toHaveLength(1);
      expect(metadata.responses[0]).toEqual(response);
      expect(metadata.params).toHaveLength(1);
      expect(metadata.params[0]).toEqual(param);
      expect(metadata.queries).toEqual([]);
      expect(metadata.body).toBeUndefined();
      expect(metadata.security).toEqual([]);
      expect(metadata.tags).toEqual([]);
    });

    it('should return empty metadata when no metadata exists', () => {
      // Act
      const metadata = MetadataManager.getHandlerMetadata(testTarget);

      // Assert
      expect(metadata.operation).toBeUndefined();
      expect(metadata.responses).toEqual([]);
      expect(metadata.params).toEqual([]);
      expect(metadata.queries).toEqual([]);
      expect(metadata.body).toBeUndefined();
      expect(metadata.security).toEqual([]);
      expect(metadata.tags).toEqual([]);
    });
  });

  describe('Metadata Utilities', () => {
    it('should check if target has metadata', () => {
      // Arrange & Act - no metadata
      expect(MetadataManager.hasMetadata(testTarget)).toBe(false);

      // Add some metadata
      MetadataManager.setOperation(testTarget, {
        functionName: 'test',
        summary: 'Test',
      });

      // Assert - has metadata
      expect(MetadataManager.hasMetadata(testTarget)).toBe(true);
    });

    it('should get existing metadata keys', () => {
      // Arrange
      MetadataManager.setOperation(testTarget, {
        functionName: 'test',
        summary: 'Test',
      });
      MetadataManager.addResponse(testTarget, {
        status: 200,
        description: 'Success',
        order: 0,
      });

      // Act
      const keys = MetadataManager.getExistingMetadataKeys(testTarget);

      // Assert
      expect(keys).toHaveLength(2);
      expect(keys).toContain(METADATA_KEYS.API_OPERATION);
      expect(keys).toContain(METADATA_KEYS.API_RESPONSES);
    });

    it('should clear all metadata', () => {
      // Arrange
      MetadataManager.setOperation(testTarget, {
        functionName: 'test',
        summary: 'Test',
      });
      MetadataManager.addResponse(testTarget, {
        status: 200,
        description: 'Success',
        order: 0,
      });

      expect(MetadataManager.hasMetadata(testTarget)).toBe(true);

      // Act
      MetadataManager.clearMetadata(testTarget);

      // Assert
      expect(MetadataManager.hasMetadata(testTarget)).toBe(false);
      expect(MetadataManager.getExistingMetadataKeys(testTarget)).toEqual([]);
    });
  });
});
