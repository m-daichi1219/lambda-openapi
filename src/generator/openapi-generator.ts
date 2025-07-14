import {
  OpenAPISpec,
  OperationObject,
  PathItemObject,
  ParameterObject,
  ResponseObject,
  SchemaObject,
} from '../types/openapi';
import { GeneratorConfig } from '../types/config';
import {
  HandlerMetadata,
  ApiResponseMetadata,
  ApiParamMetadata,
} from '../types/internal';
import { MetadataManager } from '../utils/metadata';
import { TypeReference } from '../types/decorator-options';

/**
 * Generate OpenAPI specification from Lambda handlers with metadata
 */
export class OpenApiGenerator {
  private config: GeneratorConfig;

  constructor(config: GeneratorConfig) {
    this.config = config;
  }

  /**
   * Generate OpenAPI specification from handler functions
   *
   * @param handlers - Array of handler functions with metadata
   * @returns OpenAPI specification object
   */
  generateSpec(handlers: any[]): OpenAPISpec {
    const spec: OpenAPISpec = {
      openapi: '3.0.0',
      info: this.config.info,
      paths: {},
    };

    // Add optional sections if configured
    if (this.config.servers) {
      spec.servers = this.config.servers;
    }

    if (this.config.security) {
      spec.security = this.config.security;
    }

    if (this.config.tags) {
      spec.tags = this.config.tags;
    }

    if (this.config.externalDocs) {
      spec.externalDocs = this.config.externalDocs;
    }

    // Generate paths from handlers
    const handlerPaths = this.generatePaths(handlers);
    spec.paths = handlerPaths;

    // Generate components (schemas, responses, etc.)
    spec.components = this.generateComponents(handlers);

    return spec;
  }

  /**
   * Generate paths object from handlers
   */
  private generatePaths(handlers: any[]): Record<string, PathItemObject> {
    const paths: Record<string, PathItemObject> = {};

    handlers.forEach(handler => {
      const metadata = MetadataManager.getHandlerMetadata(handler);

      // Skip handlers without operation metadata
      if (!metadata.operation) {
        return;
      }

      // Generate path from function name (this is a simplified approach)
      const path = this.generatePathFromFunction(
        metadata.operation.functionName
      );
      const operation = this.generateOperation(metadata);

      // Determine HTTP method (simplified: assume GET for now)
      const method = this.determineHttpMethod(metadata.operation.functionName);

      if (!paths[path]) {
        paths[path] = {};
      }

      // Use type assertion to assign the operation to the correct method
      (paths[path] as any)[method] = operation;
    });

    return paths;
  }

  /**
   * Generate operation object from handler metadata
   */
  private generateOperation(metadata: HandlerMetadata): OperationObject {
    const operation: OperationObject = {
      responses: {},
    };

    // Add operation metadata
    if (metadata.operation) {
      operation.summary = metadata.operation.summary;
      operation.description = metadata.operation.description;
      operation.tags = metadata.operation.tags;
      operation.operationId = metadata.operation.operationId;
      operation.deprecated = metadata.operation.deprecated;
    }

    // Add parameters
    if (metadata.params.length > 0) {
      operation.parameters = metadata.params.map(param =>
        this.generateParameter(param)
      );
    }

    // Add responses
    operation.responses = this.generateResponses(metadata.responses);

    return operation;
  }

  /**
   * Generate parameter object from parameter metadata
   */
  private generateParameter(paramMetadata: ApiParamMetadata): ParameterObject {
    const parameter: ParameterObject = {
      name: paramMetadata.name,
      in: paramMetadata.in,
      required: paramMetadata.required,
    };

    if (paramMetadata.description) {
      parameter.description = paramMetadata.description;
    }

    if (paramMetadata.deprecated) {
      parameter.deprecated = paramMetadata.deprecated;
    }

    if (paramMetadata.example !== undefined) {
      parameter.example = paramMetadata.example;
    }

    // Generate schema from type
    if (paramMetadata.type) {
      parameter.schema = this.generateSchemaFromType(paramMetadata.type);
    }

    // Add enum values
    if (paramMetadata.enum) {
      parameter.schema = {
        ...parameter.schema,
        enum: paramMetadata.enum,
      };
    }

    return parameter;
  }

  /**
   * Generate responses object from response metadata
   */
  private generateResponses(
    responseMetadata: ApiResponseMetadata[]
  ): Record<string, ResponseObject> {
    const responses: Record<string, ResponseObject> = {};

    responseMetadata.forEach(responseMeta => {
      const statusCode = responseMeta.status.toString();
      const response: ResponseObject = {
        description: responseMeta.description || `Response ${statusCode}`,
      };

      // Add content if type is specified
      if (responseMeta.type) {
        response.content = {
          'application/json': {
            schema: this.generateSchemaFromType(responseMeta.type),
          },
        };
      }

      // Add custom content if specified
      if (responseMeta.content) {
        response.content = responseMeta.content;
      }

      // Add example
      if (responseMeta.example !== undefined) {
        if (response.content && response.content['application/json']) {
          response.content['application/json'].example = responseMeta.example;
        }
      }

      responses[statusCode] = response;
    });

    // Add default 200 response if no responses are defined
    if (Object.keys(responses).length === 0) {
      responses['200'] = {
        description: 'Successful response',
      };
    }

    return responses;
  }

  /**
   * Generate schema from type reference
   */
  private generateSchemaFromType(typeRef: TypeReference): SchemaObject {
    if (typeof typeRef === 'string') {
      return this.generateSchemaFromStringType(typeRef);
    }

    // For constructor types, generate object schema
    if (typeof typeRef === 'function') {
      return {
        type: 'object',
        // TODO: Implement type introspection for constructors
        description: `Schema for ${typeRef.name}`,
      };
    }

    // Default to object type
    return {
      type: 'object',
    };
  }

  /**
   * Generate schema from string type
   */
  private generateSchemaFromStringType(type: string): SchemaObject {
    switch (type) {
      case 'string':
        return { type: 'string' };
      case 'number':
        return { type: 'number' };
      case 'integer':
        return { type: 'integer' };
      case 'boolean':
        return { type: 'boolean' };
      case 'array':
        return { type: 'array', items: { type: 'string' } };
      case 'object':
        return { type: 'object' };
      default:
        return { type: 'string' };
    }
  }

  /**
   * Generate components section
   */
  private generateComponents(handlers: any[]): any {
    // TODO: Implement component generation
    // This would include schemas, responses, parameters, etc.
    return {};
  }

  /**
   * Generate path from function name
   * This is a simplified approach - in a real implementation,
   * you'd want to configure path mapping
   */
  private generatePathFromFunction(functionName: string): string {
    // Simple convention: convert camelCase to kebab-case
    const pathName = functionName
      .replace(/Handler$/, '') // Remove Handler suffix
      .replace(/([A-Z])/g, '-$1') // Add dash before uppercase
      .toLowerCase()
      .replace(/^-/, ''); // Remove leading dash

    return `/${pathName}`;
  }

  /**
   * Determine HTTP method from function name
   * This is a simplified approach - in a real implementation,
   * you'd want to configure method mapping
   */
  private determineHttpMethod(functionName: string): string {
    const lowerName = functionName.toLowerCase();

    if (
      lowerName.includes('get') ||
      lowerName.includes('list') ||
      lowerName.includes('find')
    ) {
      return 'get';
    } else if (lowerName.includes('post') || lowerName.includes('create')) {
      return 'post';
    } else if (lowerName.includes('put') || lowerName.includes('update')) {
      return 'put';
    } else if (lowerName.includes('delete') || lowerName.includes('remove')) {
      return 'delete';
    } else if (lowerName.includes('patch')) {
      return 'patch';
    }

    // Default to GET
    return 'get';
  }
}

/**
 * Generate OpenAPI specification from handlers
 *
 * @param config - Generator configuration
 * @param handlers - Array of handler functions
 * @returns OpenAPI specification object
 */
export function generateOpenApiSpec(
  config: GeneratorConfig,
  handlers: any[]
): OpenAPISpec {
  const generator = new OpenApiGenerator(config);
  return generator.generateSpec(handlers);
}
