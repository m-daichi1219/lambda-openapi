# Basic Example

This example demonstrates the basic usage of `lambda-openapi` with simple CRUD operations.

## Files

- `handlers/` - Lambda handler functions with decorators
- `types/` - TypeScript interface definitions
- `generate.ts` - Script to generate OpenAPI documentation
- `openapi.json` - Generated OpenAPI specification

## Running the Example

```bash
# Install dependencies
npm install

# Generate OpenAPI documentation
npm run generate

# View the generated openapi.json file
```

## What's Included

- User CRUD operations (GET, POST, PUT, DELETE)
- Path parameters
- Query parameters
- Request/Response body definitions
- Error responses
- Type safety with TypeScript interfaces

## Key Learning Points

1. How to decorate Lambda handlers
2. Parameter definitions (@ApiParam, @ApiQuery, @ApiBody)
3. Response definitions (@ApiResponse)
4. Type inference from TypeScript interfaces 