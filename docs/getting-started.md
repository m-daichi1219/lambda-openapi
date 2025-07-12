# Getting Started

This guide will help you quickly get up and running with `lambda-openapi`.

## Prerequisites

- Node.js 16+
- TypeScript 4.5+
- AWS Lambda handlers using `APIGatewayProxyEvent`

## Installation

```bash
npm install lambda-openapi reflect-metadata
npm install --save-dev @types/aws-lambda
```

## TypeScript Configuration

Update your `tsconfig.json`:

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

## Your First Handler

Create a simple Lambda handler with decorators:

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiOperation, ApiResponse } from 'lambda-openapi';

@ApiOperation({
  summary: 'Hello World',
  description: 'Returns a simple greeting'
})
@ApiResponse({
  status: 200,
  description: 'Successful response',
  example: { message: 'Hello, World!' }
})
export const helloHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello, World!' })
  };
};
```

## Generate Documentation

Use the CLI to generate OpenAPI documentation:

```bash
npx lambda-openapi generate --input ./src/handlers --output ./openapi.json
```

Or use it programmatically:

```typescript
import { generateOpenApiSpec } from 'lambda-openapi';

const spec = await generateOpenApiSpec({
  inputPaths: ['./src/handlers'],
  title: 'My API',
  version: '1.0.0'
});

console.log(JSON.stringify(spec, null, 2));
```

## Next Steps

- [Learn about all available decorators](./decorators.md)
- [Explore CLI options](./cli.md)
- [See complete examples](../examples/) 