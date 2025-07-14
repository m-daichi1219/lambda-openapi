import { ApiResponseOptions } from '../types/decorator-options';
import { ApiResponseMetadata } from '../types/internal';
import { MetadataManager } from '../utils/metadata';

// Global counter for ordering responses
let responseOrder = 0;

/**
 * Decorator to define API response metadata
 *
 * @param options - Response configuration options
 * @returns Method decorator function
 *
 * @example
 * ```typescript
 * @ApiResponse({
 *   status: 200,
 *   description: 'User found',
 *   type: User
 * })
 * @ApiResponse({
 *   status: 404,
 *   description: 'User not found'
 * })
 * export const getUserHandler = async (event: APIGatewayProxyEvent) => {
 *   // implementation
 * };
 * ```
 */
export function ApiResponse(options: ApiResponseOptions) {
  return function (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: PropertyDescriptor
  ) {
    // Create metadata object with ordering
    const metadata: ApiResponseMetadata = {
      status: options.status,
      description: options.description,
      type: options.type,
      example: options.example,
      headers: options.headers,
      content: options.content,
      order: responseOrder++,
    };

    // Store metadata on the target (function or class method)
    const targetFunction = descriptor?.value || target;
    MetadataManager.addResponse(targetFunction, metadata);

    // Return the target for function decorators, descriptor for method decorators
    if (descriptor) {
      return descriptor;
    }
    return target;
  };
}

/**
 * Check if a function has ApiResponse metadata
 *
 * @param target - Target function to check
 * @returns True if the function has response metadata
 */
export function hasApiResponse(target: any): boolean {
  return MetadataManager.getResponses(target).length > 0;
}

/**
 * Get all ApiResponse metadata from a function
 *
 * @param target - Target function
 * @returns Array of response metadata
 */
export function getApiResponses(target: any): ApiResponseMetadata[] {
  return MetadataManager.getResponses(target);
}

/**
 * Get ApiResponse metadata for a specific status code
 *
 * @param target - Target function
 * @param status - HTTP status code
 * @returns Response metadata if exists, undefined otherwise
 */
export function getApiResponse(
  target: any,
  status: number
): ApiResponseMetadata | undefined {
  return MetadataManager.getResponses(target).find(
    response => response.status === status
  );
}

/**
 * Reset the response order counter (useful for testing)
 */
export function resetResponseOrder(): void {
  responseOrder = 0;
}
