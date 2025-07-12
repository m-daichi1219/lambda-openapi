# lambda-openapi

[![npm version](https://badge.fury.io/js/lambda-openapi.svg)](https://badge.fury.io/js/lambda-openapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

**TypeScript decorators to automatically generate OpenAPI documentation for AWS Lambda handlers**

`lambda-openapi` is a powerful library that allows you to automatically generate OpenAPI 3.0 documentation from your AWS Lambda handlers using TypeScript decorators. It's specifically designed for serverless applications built with AWS CDK + API Gateway + Lambda.

## ✨ Features

- 🚀 **Lambda-first**: Designed specifically for AWS Lambda handlers
- 📝 **Decorator-based**: Clean, readable API definitions using TypeScript decorators
- 🔄 **Automatic generation**: Generate OpenAPI specs from your existing code
- 🎯 **Type-safe**: Full TypeScript support with type inference
- 📊 **Multiple formats**: Output JSON or YAML
- 🛠️ **CLI & Programmatic**: Use via CLI or integrate into your build process
- 📖 **Rich documentation**: Support for parameters, responses, examples, and more

## 🚀 Quick Start

### Installation

```bash
npm install lambda-openapi reflect-metadata
npm install --save-dev @types/aws-lambda
```

### Basic Usage

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam 
} from 'lambda-openapi';

interface User {
  id: string;
  name: string;
  email: string;
}

@ApiOperation({
  summary: 'Get user by ID',
  description: 'Retrieve a user by their unique identifier',
  tags: ['users']
})
@ApiParam({ 
  name: 'userId', 
  description: 'User ID', 
  required: true, 
  type: 'string' 
})
@ApiResponse({ 
  status: 200, 
  description: 'User found', 
  type: User 
})
@ApiResponse({ 
  status: 404, 
  description: 'User not found' 
})
export const getUserHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = event.pathParameters?.userId;
  
  // Your implementation here
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      id: userId, 
      name: 'John Doe', 
      email: 'john@example.com' 
    })
  };
};
```

### Generate OpenAPI Documentation

```bash
# Using CLI
npx lambda-openapi generate --input ./src/handlers --output ./openapi.json

# Or programmatically
import { generateOpenApiSpec } from 'lambda-openapi';

const spec = await generateOpenApiSpec({
  inputPaths: ['./src/handlers'],
  title: 'My API',
  version: '1.0.0'
});
```

## 📚 Documentation

- [Getting Started](./docs/getting-started.md)
- [Decorator Reference](./docs/decorators.md)
- [CLI Usage](./docs/cli.md)
- [API Reference](./docs/api/index.html)
- [Examples](./examples/)

## 🎯 Available Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@ApiOperation` | Define operation metadata | `@ApiOperation({ summary: 'Get users' })` |
| `@ApiParam` | Path parameters | `@ApiParam({ name: 'id', type: 'string' })` |
| `@ApiQuery` | Query parameters | `@ApiQuery({ name: 'limit', type: 'number' })` |
| `@ApiBody` | Request body | `@ApiBody({ type: CreateUserRequest })` |
| `@ApiResponse` | Response definitions | `@ApiResponse({ status: 200, type: User })` |
| `@ApiSecurity` | Security requirements | `@ApiSecurity({ type: 'apiKey' })` |

## 🔧 Configuration

### TypeScript Configuration

Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES2020",
    "moduleResolution": "node"
  }
}
```

### CLI Options

```bash
lambda-openapi generate [options]

Options:
  --input, -i     Input directory containing Lambda handlers
  --output, -o    Output file path for OpenAPI spec
  --format, -f    Output format: json | yaml (default: json)
  --title, -t     API title
  --version, -v   API version
  --base-path, -b Base path for API routes
```

## 🌟 Examples

Check out the [examples directory](./examples/) for complete working examples:

- [Basic Usage](./examples/basic/) - Simple CRUD API
- [Advanced Features](./examples/advanced/) - Complex types, security, validation
- [CDK Integration](./examples/cdk/) - AWS CDK deployment example

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/yourusername/lambda-openapi.git
cd lambda-openapi
npm install
npm run build
npm test
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙋‍♂️ Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/lambda-openapi/issues)
- 💬 [Discussions](https://github.com/yourusername/lambda-openapi/discussions)

## 🚀 Roadmap

- [ ] Support for more AWS Lambda event sources
- [ ] Integration with AWS CDK constructs
- [ ] Plugin system for custom extensions
- [ ] Visual documentation generator
- [ ] Request/Response validation

---

Made with ❤️ for the AWS serverless community 