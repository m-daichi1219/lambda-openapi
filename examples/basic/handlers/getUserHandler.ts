import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApiOperation, ApiResponse, ApiParam } from 'lambda-openapi';

interface User {
  id: string;
  name: string;
  email: string;
}

export const getUserHandler = (() => {
  const handler = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
    const userId = event.pathParameters?.userId;

    // Your implementation here
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
      }),
    };
  };

  // Apply decorators
  ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a user by their unique identifier',
    tags: ['users'],
  })(handler);

  ApiParam({
    name: 'userId',
    description: 'User ID',
    required: true,
    type: 'string',
  })(handler);

  ApiResponse({
    status: 200,
    description: 'User found',
    type: 'object', // In a real scenario, you'd use User interface
  })(handler);

  ApiResponse({
    status: 404,
    description: 'User not found',
  })(handler);

  return handler;
})();
