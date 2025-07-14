import 'reflect-metadata';
import { generateOpenApiSpec } from '../../src/generator/openapi-generator';
import { ApiOperation, ApiResponse, ApiParam } from '../../src/decorators';
import { GeneratorConfig } from '../../src/types/config';

describe('End-to-End Integration Test', () => {
  it('should generate complete OpenAPI specification from decorated handlers', () => {
    // Arrange - Create sample handlers with decorators
    function getUserHandler() {
      return {
        statusCode: 200,
        body: JSON.stringify({ id: '1', name: 'John' }),
      };
    }

    function createUserHandler() {
      return {
        statusCode: 201,
        body: JSON.stringify({ id: '2', name: 'Jane' }),
      };
    }

    // Apply decorators
    ApiOperation({
      summary: 'Get user by ID',
      description: 'Retrieve a user by their unique identifier',
      tags: ['users'],
      operationId: 'getUser',
    })(getUserHandler);

    ApiParam({
      name: 'userId',
      description: 'User ID',
      type: 'string',
      required: true,
    })(getUserHandler);

    ApiResponse({
      status: 200,
      description: 'User found successfully',
      type: 'object',
    })(getUserHandler);

    ApiResponse({
      status: 404,
      description: 'User not found',
    })(getUserHandler);

    ApiOperation({
      summary: 'Create new user',
      description: 'Create a new user in the system',
      tags: ['users'],
      operationId: 'createUser',
    })(createUserHandler);

    ApiResponse({
      status: 201,
      description: 'User created successfully',
      type: 'object',
    })(createUserHandler);

    const config: GeneratorConfig = {
      inputPaths: ['./test'],
      info: {
        title: 'User Management API',
        version: '1.0.0',
        description: 'API for managing users',
      },
      servers: [
        {
          url: 'https://api.example.com/v1',
          description: 'Production server',
        },
      ],
      tags: [
        {
          name: 'users',
          description: 'User management operations',
        },
      ],
    };

    const handlers = [getUserHandler, createUserHandler];

    // Act
    const spec = generateOpenApiSpec(config, handlers);

    // Assert - Verify basic structure
    expect(spec.openapi).toBe('3.0.0');
    expect(spec.info.title).toBe('User Management API');
    expect(spec.info.version).toBe('1.0.0');
    expect(spec.info.description).toBe('API for managing users');

    // Verify servers
    expect(spec.servers).toHaveLength(1);
    expect(spec.servers![0].url).toBe('https://api.example.com/v1');

    // Verify tags
    expect(spec.tags).toHaveLength(1);
    expect(spec.tags![0].name).toBe('users');

    // Verify paths are generated
    expect(spec.paths).toBeDefined();
    expect(Object.keys(spec.paths)).toHaveLength(2);

    // Verify getUserHandler path
    expect(spec.paths['/get-user']).toBeDefined();
    const getUserPath = spec.paths['/get-user'];
    expect(getUserPath.get).toBeDefined();

    const getUserOp = getUserPath.get!;
    expect(getUserOp.summary).toBe('Get user by ID');
    expect(getUserOp.description).toBe(
      'Retrieve a user by their unique identifier'
    );
    expect(getUserOp.tags).toEqual(['users']);
    expect(getUserOp.operationId).toBe('getUser');

    // Verify parameters
    expect(getUserOp.parameters).toHaveLength(1);

    // Verify responses
    expect(getUserOp.responses).toBeDefined();
    expect(getUserOp.responses['200']).toBeDefined();
    expect(getUserOp.responses['404']).toBeDefined();

    // Verify createUserHandler path
    expect(spec.paths['/create-user']).toBeDefined();
    const createUserPath = spec.paths['/create-user'];
    expect(createUserPath.post).toBeDefined();

    const createUserOp = createUserPath.post!;
    expect(createUserOp.summary).toBe('Create new user');
    expect(createUserOp.operationId).toBe('createUser');

    // Verify responses
    expect(createUserOp.responses['201']).toBeDefined();

    console.log('Generated OpenAPI Specification:');
    console.log(JSON.stringify(spec, null, 2));
  });

  it('should handle handlers without metadata gracefully', () => {
    // Arrange
    function handlerWithoutDecorators() {
      return { statusCode: 200, body: 'OK' };
    }

    function handlerWithMetadata() {
      return { statusCode: 200, body: 'OK' };
    }

    // Only apply metadata to one handler
    ApiOperation({
      summary: 'Handler with metadata',
    })(handlerWithMetadata);

    const config: GeneratorConfig = {
      inputPaths: ['./test'],
      info: {
        title: 'Mixed Handlers API',
        version: '1.0.0',
      },
    };

    const handlers = [handlerWithoutDecorators, handlerWithMetadata];

    // Act
    const spec = generateOpenApiSpec(config, handlers);

    // Assert
    expect(spec.openapi).toBe('3.0.0');
    expect(Object.keys(spec.paths)).toHaveLength(1); // Only one handler has metadata
    expect(spec.paths['/handler-with-metadata']).toBeDefined();
  });

  it('should generate valid JSON output', () => {
    // Arrange
    function simpleHandler() {
      return { statusCode: 200, body: 'OK' };
    }

    ApiOperation({
      summary: 'Simple test handler',
      description: 'A simple handler for testing JSON generation',
    })(simpleHandler);

    ApiResponse({
      status: 200,
      description: 'Success',
    })(simpleHandler);

    const config: GeneratorConfig = {
      inputPaths: ['./test'],
      info: {
        title: 'JSON Test API',
        version: '1.0.0',
      },
    };

    // Act
    const spec = generateOpenApiSpec(config, [simpleHandler]);
    const jsonString = JSON.stringify(spec, null, 2);

    // Assert - Should be valid JSON
    expect(() => JSON.parse(jsonString)).not.toThrow();
    expect(jsonString).toContain('"openapi": "3.0.0"');
    expect(jsonString).toContain('"title": "JSON Test API"');
    expect(jsonString).toContain('"/simple"');
  });
});
