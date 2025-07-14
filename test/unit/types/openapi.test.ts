import {
  OpenAPISpec,
  InfoObject,
  PathsObject,
  OperationObject,
  ParameterObject,
  ResponseObject,
  SchemaObject,
} from '../../../src/types/openapi';

describe('OpenAPI Type Definitions', () => {
  describe('OpenAPISpec', () => {
    it('should create a valid OpenAPI spec with minimal required fields', () => {
      // Arrange
      const spec: OpenAPISpec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0',
        },
        paths: {},
      };

      // Act & Assert
      expect(spec.openapi).toBe('3.0.0');
      expect(spec.info.title).toBe('Test API');
      expect(spec.info.version).toBe('1.0.0');
      expect(spec.paths).toEqual({});
    });

    it('should create a complete OpenAPI spec with all optional fields', () => {
      // Arrange
      const spec: OpenAPISpec = {
        openapi: '3.0.0',
        info: {
          title: 'Complete API',
          version: '2.0.0',
          description: 'A comprehensive API',
          termsOfService: 'https://example.com/terms',
          contact: {
            name: 'API Support',
            url: 'https://example.com/support',
            email: 'support@example.com',
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
        servers: [
          {
            url: 'https://api.example.com',
            description: 'Production server',
          },
        ],
        paths: {
          '/users': {
            get: {
              summary: 'Get users',
              responses: {
                '200': {
                  description: 'Successful response',
                },
              },
            },
          },
        },
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
        security: [{ apiKey: [] }],
        tags: [
          {
            name: 'users',
            description: 'User operations',
          },
        ],
      };

      // Act & Assert
      expect(spec.openapi).toBe('3.0.0');
      expect(spec.info.title).toBe('Complete API');
      expect(spec.servers).toHaveLength(1);
      expect(spec.servers![0].url).toBe('https://api.example.com');
      expect(spec.paths['/users']).toBeDefined();
      expect(spec.components?.schemas?.User).toBeDefined();
      expect(spec.security).toHaveLength(1);
      expect(spec.tags).toHaveLength(1);
    });
  });

  describe('InfoObject', () => {
    it('should create valid info object with required fields', () => {
      // Arrange
      const info: InfoObject = {
        title: 'My API',
        version: '1.0.0',
      };

      // Act & Assert
      expect(info.title).toBe('My API');
      expect(info.version).toBe('1.0.0');
    });

    it('should create valid info object with all optional fields', () => {
      // Arrange
      const info: InfoObject = {
        title: 'My API',
        version: '1.0.0',
        description: 'A great API',
        termsOfService: 'https://example.com/terms',
        contact: {
          name: 'John Doe',
          url: 'https://johndoe.com',
          email: 'john@example.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      };

      // Act & Assert
      expect(info.title).toBe('My API');
      expect(info.version).toBe('1.0.0');
      expect(info.description).toBe('A great API');
      expect(info.contact?.name).toBe('John Doe');
      expect(info.license?.name).toBe('MIT');
    });
  });

  describe('OperationObject', () => {
    it('should create valid operation with minimal required fields', () => {
      // Arrange
      const operation: OperationObject = {
        responses: {
          '200': {
            description: 'Success',
          },
        },
      };

      // Act & Assert
      expect(operation.responses['200']).toBeDefined();
      const response = operation.responses['200'] as ResponseObject;
      expect(response.description).toBe('Success');
    });

    it('should create valid operation with all optional fields', () => {
      // Arrange
      const operation: OperationObject = {
        tags: ['users'],
        summary: 'Get user',
        description: 'Retrieve a user by ID',
        operationId: 'getUser',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User found',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
          '404': {
            description: 'User not found',
          },
        },
        deprecated: false,
      };

      // Act & Assert
      expect(operation.tags).toContain('users');
      expect(operation.summary).toBe('Get user');
      expect(operation.operationId).toBe('getUser');
      expect(operation.parameters).toHaveLength(1);
      const parameter = operation.parameters![0] as ParameterObject;
      expect(parameter.name).toBe('id');
      expect(operation.deprecated).toBe(false);
    });
  });

  describe('ParameterObject', () => {
    it('should create valid path parameter', () => {
      // Arrange
      const parameter: ParameterObject = {
        name: 'userId',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      };

      // Act & Assert
      expect(parameter.name).toBe('userId');
      expect(parameter.in).toBe('path');
      expect(parameter.required).toBe(true);
      expect(parameter.schema).toEqual({ type: 'string' });
    });

    it('should create valid query parameter with all options', () => {
      // Arrange
      const parameter: ParameterObject = {
        name: 'limit',
        in: 'query',
        description: 'Number of items to return',
        required: false,
        schema: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          default: 10,
        },
        example: 20,
      };

      // Act & Assert
      expect(parameter.name).toBe('limit');
      expect(parameter.in).toBe('query');
      expect(parameter.description).toBe('Number of items to return');
      expect(parameter.required).toBe(false);
      expect(parameter.example).toBe(20);
    });
  });

  describe('ResponseObject', () => {
    it('should create valid response with minimal fields', () => {
      // Arrange
      const response: ResponseObject = {
        description: 'Successful response',
      };

      // Act & Assert
      expect(response.description).toBe('Successful response');
    });

    it('should create valid response with content', () => {
      // Arrange
      const response: ResponseObject = {
        description: 'User data',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
      };

      // Act & Assert
      expect(response.description).toBe('User data');
      expect(response.content!['application/json']).toBeDefined();
      expect(response.content!['application/json'].schema).toBeDefined();
    });
  });

  describe('SchemaObject', () => {
    it('should create valid primitive schema', () => {
      // Arrange
      const schema: SchemaObject = {
        type: 'string',
        description: 'A string value',
      };

      // Act & Assert
      expect(schema.type).toBe('string');
      expect(schema.description).toBe('A string value');
    });

    it('should create valid object schema', () => {
      // Arrange
      const schema: SchemaObject = {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          age: { type: 'integer', minimum: 0 },
        },
        required: ['id', 'name'],
      };

      // Act & Assert
      expect(schema.type).toBe('object');
      expect(schema.properties!.id).toEqual({ type: 'string' });
      expect(schema.properties!.name).toEqual({ type: 'string' });
      expect(schema.properties!.age).toEqual({ type: 'integer', minimum: 0 });
      expect(schema.required).toEqual(['id', 'name']);
    });

    it('should create valid array schema', () => {
      // Arrange
      const schema: SchemaObject = {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 10,
      };

      // Act & Assert
      expect(schema.type).toBe('array');
      expect(schema.items).toEqual({ type: 'string' });
      expect(schema.minItems).toBe(1);
      expect(schema.maxItems).toBe(10);
    });
  });
});
