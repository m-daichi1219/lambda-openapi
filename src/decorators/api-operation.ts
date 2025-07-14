import { ApiOperationOptions } from '../types/decorator-options';
import { ApiOperationMetadata } from '../types/internal';
import { MetadataManager } from '../utils/metadata';

/**
 * Decorator to define API operation metadata
 *
 * @param options - Operation configuration options
 * @returns Method decorator function
 *
 * @example
 * ```typescript
 * @ApiOperation({
 *   summary: 'Get user by ID',
 *   description: 'Retrieves a user by their unique identifier',
 *   tags: ['users']
 * })
 * export const getUserHandler = async (event: APIGatewayProxyEvent) => {
 *   // implementation
 * };
 * ```
 */
export function ApiOperation(options: ApiOperationOptions) {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    // Get the function name from the property key or function name
    let functionName: string;
    if (propertyKey) {
      functionName = String(propertyKey);
    } else {
      functionName = target.name || 'anonymous';
    }

    // Create metadata object
    const metadata: ApiOperationMetadata = {
      functionName,
      summary: options.summary,
      description: options.description,
      tags: options.tags,
      operationId: options.operationId,
      deprecated: options.deprecated,
    };

    // Store metadata on the target (function or class method)
    const targetFunction = descriptor?.value || target;
    MetadataManager.setOperation(targetFunction, metadata);

    // Return the target for function decorators, descriptor for method decorators
    if (descriptor) {
      return descriptor;
    }
    return target;
  };
}

/**
 * Check if a function has ApiOperation metadata
 *
 * @param target - Target function to check
 * @returns True if the function has operation metadata
 */
export function hasApiOperation(target: any): boolean {
  return MetadataManager.getOperation(target) !== undefined;
}

/**
 * Get ApiOperation metadata from a function
 *
 * @param target - Target function
 * @returns Operation metadata if exists, undefined otherwise
 */
export function getApiOperation(target: any): ApiOperationMetadata | undefined {
  return MetadataManager.getOperation(target);
}
