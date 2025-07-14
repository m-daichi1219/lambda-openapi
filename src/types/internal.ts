/**
 * Internal type definitions for metadata storage and processing
 */

import { ApiOperationOptions, ApiResponseOptions, ApiParamOptions, ApiQueryOptions, ApiBodyOptions, ApiSecurityOptions, ApiTagOptions } from './decorator-options';

/**
 * Metadata key constants for reflect-metadata
 */
export const METADATA_KEYS = {
  API_OPERATION: 'lambda-openapi:operation',
  API_RESPONSES: 'lambda-openapi:responses',
  API_PARAMS: 'lambda-openapi:params',
  API_QUERIES: 'lambda-openapi:queries',
  API_BODY: 'lambda-openapi:body',
  API_SECURITY: 'lambda-openapi:security',
  API_TAGS: 'lambda-openapi:tags',
} as const;

/**
 * Stored metadata for API operations
 */
export interface ApiOperationMetadata extends ApiOperationOptions {
  /** Function name */
  functionName: string;
  /** File path */
  filePath?: string;
}

/**
 * Stored metadata for API responses
 */
export interface ApiResponseMetadata extends ApiResponseOptions {
  /** Order in which the decorator was applied */
  order: number;
}

/**
 * Stored metadata for API parameters
 */
export interface ApiParamMetadata extends ApiParamOptions {
  /** Parameter location */
  in: 'path' | 'query' | 'header' | 'cookie';
  /** Order in which the decorator was applied */
  order: number;
}

/**
 * Stored metadata for API query parameters
 */
export interface ApiQueryMetadata extends ApiQueryOptions {
  /** Order in which the decorator was applied */
  order: number;
}

/**
 * Stored metadata for API body
 */
export interface ApiBodyMetadata extends ApiBodyOptions {
  /** Order in which the decorator was applied */
  order: number;
}

/**
 * Stored metadata for API security
 */
export interface ApiSecurityMetadata extends ApiSecurityOptions {
  /** Order in which the decorator was applied */
  order: number;
}

/**
 * Stored metadata for API tags
 */
export interface ApiTagMetadata extends ApiTagOptions {
  /** Order in which the decorator was applied */
  order: number;
}

/**
 * Complete metadata for a Lambda handler function
 */
export interface HandlerMetadata {
  /** Operation metadata */
  operation?: ApiOperationMetadata;
  /** Response metadata */
  responses: ApiResponseMetadata[];
  /** Parameter metadata */
  params: ApiParamMetadata[];
  /** Query parameter metadata */
  queries: ApiQueryMetadata[];
  /** Body metadata */
  body?: ApiBodyMetadata;
  /** Security metadata */
  security: ApiSecurityMetadata[];
  /** Tag metadata */
  tags: ApiTagMetadata[];
}

/**
 * Function information extracted from TypeScript analysis
 */
export interface FunctionInfo {
  /** Function name */
  name: string;
  /** File path */
  filePath: string;
  /** Line number */
  line: number;
  /** Column number */
  column: number;
  /** Function parameters */
  parameters: ParameterInfo[];
  /** Return type */
  returnType: TypeInfo;
  /** Whether the function is exported */
  isExported: boolean;
  /** Whether the function is a Lambda handler */
  isLambdaHandler: boolean;
}

/**
 * Parameter information
 */
export interface ParameterInfo {
  /** Parameter name */
  name: string;
  /** Parameter type */
  type: TypeInfo;
  /** Whether the parameter is optional */
  optional: boolean;
}

/**
 * Type information
 */
export interface TypeInfo {
  /** Type name */
  name: string;
  /** Type kind */
  kind: 'primitive' | 'object' | 'array' | 'union' | 'intersection' | 'generic' | 'unknown';
  /** Properties for object types */
  properties?: PropertyInfo[];
  /** Element type for array types */
  elementType?: TypeInfo;
  /** Union/intersection members */
  members?: TypeInfo[];
  /** Generic arguments */
  genericArgs?: TypeInfo[];
  /** Whether the type is nullable */
  nullable?: boolean;
}

/**
 * Property information for object types
 */
export interface PropertyInfo {
  /** Property name */
  name: string;
  /** Property type */
  type: TypeInfo;
  /** Whether the property is optional */
  optional: boolean;
  /** Property description from JSDoc */
  description?: string;
} 