/**
 * Configuration type definitions
 */

/**
 * Configuration for OpenAPI generation
 */
export interface GeneratorConfig {
  /** Input paths to scan for Lambda handlers */
  inputPaths: string[];
  /** Output file path */
  outputPath?: string;
  /** Output format */
  format?: 'json' | 'yaml';
  /** API information */
  info: {
    /** API title */
    title: string;
    /** API version */
    version: string;
    /** API description */
    description?: string;
    /** Terms of service URL */
    termsOfService?: string;
    /** Contact information */
    contact?: {
      name?: string;
      url?: string;
      email?: string;
    };
    /** License information */
    license?: {
      name: string;
      url?: string;
    };
  };
  /** Server information */
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  /** Base path for API routes */
  basePath?: string;
  /** Global security definitions */
  security?: Array<{
    [key: string]: string[];
  }>;
  /** Global tags */
  tags?: Array<{
    name: string;
    description?: string;
    externalDocs?: {
      description?: string;
      url: string;
    };
  }>;
  /** External documentation */
  externalDocs?: {
    description?: string;
    url: string;
  };
  /** Generation options */
  options?: {
    /** Include only exported functions */
    exportedOnly?: boolean;
    /** Include function names in operation IDs */
    includeOperationIds?: boolean;
    /** Sort paths alphabetically */
    sortPaths?: boolean;
    /** Sort operations by HTTP method */
    sortOperations?: boolean;
    /** Include Lambda-specific extensions */
    includeLambdaExtensions?: boolean;
    /** Validate generated schema */
    validateSchema?: boolean;
    /** Pretty print JSON output */
    prettyPrint?: boolean;
  };
}

/**
 * CLI configuration
 */
export interface CliConfig {
  /** Input directory or files */
  input: string | string[];
  /** Output file path */
  output?: string;
  /** Output format */
  format?: 'json' | 'yaml';
  /** API title */
  title?: string;
  /** API version */
  version?: string;
  /** API description */
  description?: string;
  /** Base path */
  basePath?: string;
  /** Configuration file path */
  config?: string;
  /** Watch for changes */
  watch?: boolean;
  /** Verbose output */
  verbose?: boolean;
  /** Dry run mode */
  dryRun?: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<GeneratorConfig> = {
  format: 'json',
  info: {
    title: 'Lambda API',
    version: '1.0.0',
    description: 'API documentation generated from Lambda handlers',
  },
  servers: [
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
  options: {
    exportedOnly: true,
    includeOperationIds: true,
    sortPaths: true,
    sortOperations: true,
    includeLambdaExtensions: true,
    validateSchema: true,
    prettyPrint: true,
  },
};

/**
 * Validation rules for configuration
 */
export interface ConfigValidationRule {
  /** Rule name */
  name: string;
  /** Validation function */
  validate: (config: GeneratorConfig) => boolean;
  /** Error message */
  message: string;
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  /** Whether the configuration is valid */
  isValid: boolean;
  /** Validation errors */
  errors: Array<{
    rule: string;
    message: string;
  }>;
  /** Validation warnings */
  warnings: Array<{
    rule: string;
    message: string;
  }>;
} 