/**
 * Type definitions for decorator options
 */

// Type constructor for class types
export type TypeConstructor = new (...args: any[]) => any;

// Type reference that can be a constructor or a string
export type TypeReference = TypeConstructor | string | 'string' | 'number' | 'boolean' | 'object' | 'array';

/**
 * Options for @ApiOperation decorator
 */
export interface ApiOperationOptions {
  /** Brief summary of the operation */
  summary: string;
  /** Detailed description of the operation */
  description?: string;
  /** List of tags for API documentation grouping */
  tags?: string[];
  /** Unique identifier for the operation */
  operationId?: string;
  /** Mark the operation as deprecated */
  deprecated?: boolean;
}

/**
 * Options for @ApiResponse decorator
 */
export interface ApiResponseOptions {
  /** HTTP status code */
  status: number;
  /** Response description */
  description?: string;
  /** Type of the response body */
  type?: TypeReference;
  /** Example response */
  example?: any;
  /** Response headers */
  headers?: Record<string, ApiHeaderOptions>;
  /** Content type specific schemas */
  content?: Record<string, any>;
}

/**
 * Options for @ApiParam decorator
 */
export interface ApiParamOptions {
  /** Parameter name */
  name: string;
  /** Parameter description */
  description?: string;
  /** Whether the parameter is required */
  required?: boolean;
  /** Parameter type */
  type?: TypeReference;
  /** Example value */
  example?: any;
  /** Enum values */
  enum?: any[];
  /** Mark as deprecated */
  deprecated?: boolean;
}

/**
 * Options for @ApiQuery decorator
 */
export interface ApiQueryOptions {
  /** Query parameter name */
  name: string;
  /** Parameter description */
  description?: string;
  /** Whether the parameter is required */
  required?: boolean;
  /** Parameter type */
  type?: TypeReference;
  /** Example value */
  example?: any;
  /** Enum values */
  enum?: any[];
  /** Mark as deprecated */
  deprecated?: boolean;
  /** Allow empty value */
  allowEmptyValue?: boolean;
}

/**
 * Options for @ApiHeader decorator
 */
export interface ApiHeaderOptions {
  /** Header name */
  name?: string;
  /** Header description */
  description?: string;
  /** Whether the header is required */
  required?: boolean;
  /** Header type */
  type?: TypeReference;
  /** Example value */
  example?: any;
  /** Mark as deprecated */
  deprecated?: boolean;
}

/**
 * Options for @ApiBody decorator
 */
export interface ApiBodyOptions {
  /** Request body description */
  description?: string;
  /** Request body type */
  type?: TypeReference;
  /** Whether the body is required */
  required?: boolean;
  /** Example request body */
  example?: any;
  /** Content type specific schemas */
  content?: Record<string, any>;
}

/**
 * Options for @ApiSecurity decorator
 */
export interface ApiSecurityOptions {
  /** Security scheme type */
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  /** Security scheme name */
  name?: string;
  /** Location of the API key */
  in?: 'query' | 'header' | 'cookie';
  /** HTTP authentication scheme */
  scheme?: 'basic' | 'bearer' | string;
  /** Bearer token format */
  bearerFormat?: string;
  /** OAuth2 scopes */
  scopes?: string[];
  /** OpenID Connect URL */
  openIdConnectUrl?: string;
  /** Description of the security scheme */
  description?: string;
}

/**
 * Options for @ApiTag decorator
 */
export interface ApiTagOptions {
  /** Tag name */
  name: string;
  /** Tag description */
  description?: string;
  /** External documentation */
  externalDocs?: {
    description?: string;
    url: string;
  };
} 