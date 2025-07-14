import { ApiParamOptions } from '../types/decorator-options';
import { ApiParamMetadata } from '../types/internal';
import { MetadataManager } from '../utils/metadata';

// Global counter for ordering parameters
let paramOrder = 0;

/**
 * Decorator to define API path parameter metadata
 *
 * @param options - Parameter configuration options
 * @returns Method decorator function
 *
 * @example
 * ```typescript
 * @ApiParam({
 *   name: 'userId',
 *   description: 'User ID',
 *   required: true,
 *   type: 'string'
 * })
 * @ApiParam({
 *   name: 'groupId',
 *   description: 'Group ID',
 *   required: true,
 *   type: 'string'
 * })
 * export const getUserHandler = async (event: APIGatewayProxyEvent) => {
 *   // implementation
 * };
 * ```
 */
export function ApiParam(options: ApiParamOptions) {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    // Create metadata object with ordering
    const metadata: ApiParamMetadata = {
      name: options.name,
      description: options.description,
      required: options.required !== undefined ? options.required : true, // Path params are typically required
      type: options.type,
      example: options.example,
      enum: options.enum,
      deprecated: options.deprecated,
      in: 'path', // Path parameters are always in the path
      order: paramOrder++,
    };

    // Store metadata on the target (function or class method)
    const targetFunction = descriptor?.value || target;
    MetadataManager.addParam(targetFunction, metadata);

    // Return the target for function decorators, descriptor for method decorators
    if (descriptor) {
      return descriptor;
    }
    return target;
  };
}

/**
 * Check if a function has ApiParam metadata
 *
 * @param target - Target function to check
 * @returns True if the function has parameter metadata
 */
export function hasApiParam(target: any): boolean {
  return MetadataManager.getParams(target).length > 0;
}

/**
 * Get all ApiParam metadata from a function
 *
 * @param target - Target function
 * @returns Array of parameter metadata
 */
export function getApiParams(target: any): ApiParamMetadata[] {
  return MetadataManager.getParams(target);
}

/**
 * Get ApiParam metadata for a specific parameter name
 *
 * @param target - Target function
 * @param name - Parameter name
 * @returns Parameter metadata if exists, undefined otherwise
 */
export function getApiParam(
  target: any,
  name: string
): ApiParamMetadata | undefined {
  return MetadataManager.getParams(target).find(param => param.name === name);
}

/**
 * Reset the parameter order counter (useful for testing)
 */
export function resetParamOrder(): void {
  paramOrder = 0;
}
